from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime


class URLSchema(BaseModel):
    original_url: HttpUrl
    short_code: Optional[str] = None
    created_at: Optional[datetime] = None
    visits: int = 0


class URLResponse(BaseModel):
    short_code: str
    original_url: HttpUrl
    visits: int
