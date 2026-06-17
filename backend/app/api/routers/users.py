from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.user import User
from app.models.video import Video
from app.schemas.user import UserProfile

router = APIRouter(prefix="/users", tags=["users"])


@router.get("/me", response_model=UserProfile)
def me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> UserProfile:
    total_videos = db.scalar(select(func.count(Video.id)).where(Video.owner_id == current_user.id)) or 0
    total_views = db.scalar(select(func.coalesce(func.sum(Video.view_count), 0)).where(Video.owner_id == current_user.id)) or 0
    return UserProfile.model_validate(current_user, from_attributes=True).model_copy(
        update={"total_videos": total_videos, "total_views": total_views}
    )
