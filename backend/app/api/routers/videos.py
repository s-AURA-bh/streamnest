import json

from fastapi import APIRouter, Depends, File, Form, HTTPException, Request, UploadFile, status
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_user
from app.crud.categories import get_category
from app.crud.videos import (
    create_video,
    delete_video,
    get_video,
    list_videos,
    record_view,
    related_videos,
    search_videos,
    trending_videos,
    update_video,
    user_videos,
)
from app.db.session import get_db
from app.models.user import User
from app.schemas.video import DashboardStats, VideoList, VideoRead, VideoUpdate
from app.services.storage import public_url, save_upload
from app.services.cloudinary_storage import upload_video, upload_image

router = APIRouter(prefix="/videos", tags=["videos"])


def serialize_video(video) -> VideoRead:
    return VideoRead(
        id=video.id,
        title=video.title,
        description=video.description,
        video_url=public_url(video.video_path),
        thumbnail_url=public_url(video.thumbnail_path),
        view_count=video.view_count,
        created_at=video.created_at,
        updated_at=video.updated_at,
        owner=video.owner,
        category=video.category,
        tags=[tag.name for tag in video.tags],
    )


def parse_tags(raw_tags: str) -> list[str]:
    if not raw_tags:
        return []
    try:
        parsed = json.loads(raw_tags)
        if isinstance(parsed, list):
            return [str(tag) for tag in parsed]
    except json.JSONDecodeError:
        pass
    return [tag.strip() for tag in raw_tags.split(",") if tag.strip()]


@router.get("", response_model=VideoList)
def videos(page: int = 1, page_size: int = 12, category_id: int | None = None, db: Session = Depends(get_db)) -> VideoList:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)
    items, total = list_videos(db, page=page, page_size=page_size, category_id=category_id)
    return VideoList(items=[serialize_video(item) for item in items], total=total, page=page, page_size=page_size)


@router.get("/latest", response_model=list[VideoRead])
def latest(db: Session = Depends(get_db)) -> list[VideoRead]:
    items, _ = list_videos(db, page=1, page_size=12)
    return [serialize_video(item) for item in items]


@router.get("/trending", response_model=list[VideoRead])
def trending(db: Session = Depends(get_db)) -> list[VideoRead]:
    return [serialize_video(item) for item in trending_videos(db)]


@router.get("/search", response_model=VideoList)
def search(q: str, page: int = 1, page_size: int = 12, db: Session = Depends(get_db)) -> VideoList:
    page = max(page, 1)
    page_size = min(max(page_size, 1), 50)
    items, total = search_videos(db, query=q, page=page, page_size=page_size)
    return VideoList(items=[serialize_video(item) for item in items], total=total, page=page, page_size=page_size)


@router.get("/me/dashboard", response_model=DashboardStats)
def dashboard(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> DashboardStats:
    videos_for_user = user_videos(db, current_user)
    serialized = [serialize_video(item) for item in videos_for_user]
    return DashboardStats(
        videos=serialized,
        total_views=sum(video.view_count for video in videos_for_user),
        total_videos=len(videos_for_user),
    )


@router.get("/{video_id}", response_model=dict)
def watch(video_id: int, db: Session = Depends(get_db)) -> dict:
    video = get_video(db, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found.")
    return {
        "video": serialize_video(video),
        "related": [serialize_video(item) for item in related_videos(db, video)],
    }


@router.post("/{video_id}/view", response_model=VideoRead)
def add_view(
    video_id: int,
    request: Request,
    current_user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
) -> VideoRead:
    video = get_video(db, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found.")
    updated = record_view(
        db,
        video,
        user=current_user,
        ip_address=request.client.host if request.client else None,
        user_agent=request.headers.get("user-agent"),
    )
    return serialize_video(updated)


@router.post("", response_model=VideoRead, status_code=status.HTTP_201_CREATED)
async def upload_video(
    title: str = Form(..., min_length=3, max_length=180),
    description: str = Form(..., min_length=1, max_length=5000),
    category_id: int = Form(...),
    tags: str = Form(""),
    video: UploadFile = File(...),
    thumbnail: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> VideoRead:
    category = get_category(db, category_id)
    if category is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    video_path = await upload_video(video)
thumbnail_path = await upload_image(thumbnail)
created = create_video(
        db,
        owner=current_user,
        title=title,
        description=description,
        category=category,
        video_path=video_path,
        thumbnail_path=thumbnail_path,
        tags=parse_tags(tags),
    )
    return serialize_video(created)


@router.put("/{video_id}", response_model=VideoRead)
def edit_video(
    video_id: int,
    payload: VideoUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> VideoRead:
    video = get_video(db, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found.")
    if video.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot edit this video.")
    category = get_category(db, payload.category_id) if payload.category_id else None
    if payload.category_id and category is None:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid category.")
    return serialize_video(update_video(db, video, payload, category))


@router.delete("/{video_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_video(video_id: int, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> None:
    video = get_video(db, video_id)
    if video is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Video not found.")
    if video.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You cannot delete this video.")
    delete_video(db, video)
