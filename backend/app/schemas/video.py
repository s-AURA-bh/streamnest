from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.category import CategoryRead
from app.schemas.user import UserRead


class VideoBase(BaseModel):
    title: str = Field(min_length=3, max_length=180)
    description: str = Field(min_length=1, max_length=5000)
    category_id: int
    tags: list[str] = Field(default_factory=list, max_length=20)


class VideoUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=3, max_length=180)
    description: str | None = Field(default=None, min_length=1, max_length=5000)
    category_id: int | None = None
    tags: list[str] | None = Field(default=None, max_length=20)


class VideoRead(BaseModel):
    id: int
    title: str
    description: str
    video_url: str
    thumbnail_url: str
    view_count: int
    created_at: datetime
    updated_at: datetime
    owner: UserRead
    category: CategoryRead
    tags: list[str]


class VideoList(BaseModel):
    items: list[VideoRead]
    total: int
    page: int
    page_size: int


class DashboardStats(BaseModel):
    videos: list[VideoRead]
    total_views: int
    total_videos: int
