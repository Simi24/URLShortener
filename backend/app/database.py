from motor.motor_asyncio import AsyncIOMotorClient
from os import getenv


class Database:
    client: AsyncIOMotorClient = None

    @classmethod
    async def connect_db(cls):
        cls.client = AsyncIOMotorClient(getenv("MONGODB_URL", "mongodb://localhost:27017"))
        cls.db = cls.client.urlshortener

    @classmethod
    async def close_db(cls):
        if cls.client:
            await cls.client.close()
