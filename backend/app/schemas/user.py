from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class UserCreate(BaseModel):
    email: EmailStr
    username: str = Field(min_length=3, max_length=80, pattern=r"^[a-zA-Z0-9_]+$")
    full_name: str | None = Field(default=None, max_length=120)
    password: str = Field(min_length=8, max_length=128)


class UserRead(BaseModel):
    id: int
    email: EmailStr
    username: str
    full_name: str | None
    created_at: datetime

    model_config = {"from_attributes": True}


class UserProfile(UserRead):
    total_videos: int = 0
    total_views: int = 0
