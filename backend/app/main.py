from fastapi import FastAPI, HTTPException
from fastapi.responses import RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from .models import URLSchema, URLResponse
from .database import Database
from nanoid import generate
from pymongo.errors import DuplicateKeyError
from datetime import datetime, timezone
from .cache import RedisCache
from .utils.logger import Logger

app = FastAPI()
logger = Logger()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_db_client():
    logger.info("Starting application initialization...")
    try:
        logger.info("Connecting to MongoDB database...")
        await Database.connect_db()
        logger.info("Connecting to Redis cache...")
        await RedisCache.connect_cache()

        logger.info("Creating database indexes...")
        await Database.db.urls.create_index([("short_code", 1)], unique=True)
        await Database.db.urls.create_index([("original_url", 1)], unique=True)
        # Create an index to automatically delete documents after 30 days
        await Database.db.urls.create_index(
            [("created_at", 1)], expireAfterSeconds=30 * 24 * 60 * 60  # 30 days in seconds
        )
        logger.success("Application initialized successfully!")
    except Exception as e:
        logger.error(f"Failed to initialize application: {str(e)}")
        raise e


@app.on_event("shutdown")
async def shutdown_db_client():
    logger.info("Initiating application shutdown...")
    try:
        await logger.stop()
        await Database.close_db()
        logger.success("Application shutdown completed successfully")
    except Exception as e:
        logger.error(f"Error during shutdown: {str(e)}")


@app.post("/api/shorten", response_model=URLResponse)
async def create_short_url(url: URLSchema):
    max_attempts = 5
    logger.info(f"URL shortening request received for: {url.original_url}")

    for _ in range(max_attempts):
        try:
            short_code = generate(size=6)
            url_doc = {
                "original_url": str(url.original_url),
                "short_code": short_code,
                "created_at": datetime.now(timezone.utc),
                "visits": 0,
            }

            await Database.db.urls.insert_one(url_doc)
            logger.success(f"URL shortened successfully: {short_code}")
            return URLResponse(short_code=short_code, original_url=str(url.original_url), visits=0)

        except DuplicateKeyError as e:
            # Check if the error is due to a duplicated short_code
            if "short_code" in str(e):
                logger.warning(f"Collision detected for short code: {short_code}")
                continue

            # If the error is due to a duplicated original_url, return the existing short_code
            existing_url = await Database.db.urls.find_one({"original_url": str(url.original_url)})
            if existing_url:
                logger.info(f"URL already exists with short code: {existing_url['short_code']}")
                return URLResponse(
                    short_code=existing_url["short_code"],
                    original_url=existing_url["original_url"],
                    visits=existing_url["visits"],
                )

    logger.error(f"Failed to generate unique short code after {max_attempts} attempts")
    raise HTTPException(status_code=500, detail=f"Failed to generate unique short code after {max_attempts} attempts")


@app.get("/{short_code}")
async def redirect_url(short_code: str):
    start_time = datetime.now()
    logger.info(f"Redirect request received for code: {short_code}")

    try:
        # Check cache first
        cached_url = await RedisCache.get_url(short_code)
        if cached_url:
            logger.debug(f"Cache hit for {short_code}")

            # Create a coroutine to update the visit count in the background
            async def update_visits():
                try:
                    await Database.db.urls.update_one({"short_code": short_code}, {"$inc": {"visits": 1}})
                except Exception as e:
                    logger.error(f"Error updating visit count: {str(e)}")

            # Launch the background task
            asyncio.create_task(update_visits())
            process_time = (datetime.now() - start_time).total_seconds()
            logger.success(f"Redirect served from cache (took {process_time:.2f}s)")
            return RedirectResponse(url=cached_url)

        logger.debug(f"Cache miss for {short_code}, querying database")
        url_doc = await Database.db.urls.find_one_and_update(
            {"short_code": short_code}, {"$inc": {"visits": 1}}, return_document=True
        )

        if not url_doc:
            logger.warning(f"URL not found for short code: {short_code}")
            raise HTTPException(status_code=404, detail="URL not found")

        # Update cache
        await RedisCache.set_url(short_code, url_doc["original_url"])
        process_time = (datetime.now() - start_time).total_seconds()
        logger.success(f"Redirect successful: {short_code} -> {url_doc['original_url']} (took {process_time:.2f}s)")
        return RedirectResponse(url=url_doc["original_url"])

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing redirect for {short_code}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")


@app.get("/api/url/{short_code}")
async def get_original_url(short_code: str):
    logger.info(f"Original URL requested for short code: {short_code}")

    try:
        url_doc = await Database.db.urls.find_one({"short_code": short_code})
    except Exception as e:
        logger.error(f"Db error retrieving URL for {short_code}: {str(e)}")
        return HTTPException(status_code=500, detail="Internal server error")

    if not url_doc:
        logger.debug(f"URL not found for short code: {short_code}")
        raise HTTPException(status_code=404, detail="URL not found")

    logger.success(f"Original URL retrieved for {short_code}")
    return {"original_url": url_doc["original_url"]}


@app.get("/api/stats/{short_code}")
async def get_url_stats(short_code: str):
    logger.info(f"Stats requested for short code: {short_code}")
    try:
        url_doc = await Database.db.urls.find_one({"short_code": short_code})
        if not url_doc:
            logger.warning(f"Stats not found for short code: {short_code}")
            raise HTTPException(status_code=404, detail="URL not found")

        logger.success(f"Stats retrieved for {short_code}")
        return {"visits": url_doc["visits"], "created_at": url_doc["created_at"]}
    except Exception as e:
        logger.error(f"Error retrieving stats for {short_code}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")
