from typing import Optional, Union
from redis.asyncio import Redis
from os import getenv


class RedisCache:
    client: Redis = None

    @classmethod
    async def connect_cache(cls):
        cls.client = Redis(host=getenv("REDIS_URL", "redis"), port=6379, db=0)

    @classmethod
    async def get_url(cls, short_code: str) -> Union[str, None]:
        if cls.client is None:
            return None
        cached = await cls.client.get(short_code)
        return cached.decode("utf-8") if cached else None

    @classmethod
    async def set_url(cls, short_code: str, original_url: str) -> bool:
        if cls.client is None:
            return False
        return await cls.client.set(short_code, original_url.encode("utf-8"))

    @classmethod
    async def close_cache(cls):
        if cls.client is not None:
            await cls.client.close()
