from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from .models import URLSchema, URLResponse
from .database import Database
from nanoid import generate
from datetime import datetime, timezone

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# TODO: try handling the potential errors that might occur when connecting to the database
# TODO: try handling the potential errors due to wrong data given by the user, for instance no data given or wrong data type


@app.on_event("startup")
async def startup_db_client():
    await Database.connect_db()


@app.on_event("shutdown")
async def shutdown_db_client():
    await Database.close_db()


@app.post("/api/shorten", response_model=URLResponse)
async def create_short_url(url: URLSchema):
    existing_url = await Database.db.urls.find_one({"original_url": str(url.original_url)})
    if existing_url:
        return URLResponse(
            short_code=existing_url["short_code"],
            original_url=existing_url["original_url"],
            visits=existing_url["visits"],
        )

    short_code = generate(size=6)
    url_doc = {
        "original_url": str(url.original_url),
        "short_code": short_code,
        "created_at": datetime.now(timezone.utc),
        "visits": 0,
    }

    await Database.db.urls.insert_one(url_doc)
    return URLResponse(short_code=short_code, original_url=str(url.original_url), visits=0)


@app.get("/{short_code}")
async def redirect_url(short_code: str):
    url_doc = await Database.db.urls.find_one_and_update(
        {"short_code": short_code}, {"$inc": {"visits": 1}}, return_document=True
    )

    if not url_doc:
        raise HTTPException(status_code=404, detail="URL not found")

    return {"original_url": url_doc["original_url"]}


@app.get("/api/stats/{short_code}", response_model=URLResponse)
async def get_url_stats(short_code: str):
    url_doc = await Database.db.urls.find_one({"short_code": short_code})
    if not url_doc:
        raise HTTPException(status_code=404, detail="URL not found")

    return URLResponse(
        short_code=url_doc["short_code"], original_url=url_doc["original_url"], visits=url_doc["visits"]
    )
