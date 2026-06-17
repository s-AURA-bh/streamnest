from sqlalchemy import Select, func, or_, select
from sqlalchemy.orm import Session, joinedload

from app.models.category import Category
from app.models.tag import Tag
from app.models.user import User
from app.models.video import Video
from app.models.view import View
from app.schemas.video import VideoUpdate


def _with_video_relations(stmt: Select[tuple[Video]]) -> Select[tuple[Video]]:
    return stmt.options(joinedload(Video.owner), joinedload(Video.category), joinedload(Video.tags))


def normalize_tags(tags: list[str]) -> list[str]:
    seen: set[str] = set()
    normalized: list[str] = []
    for tag in tags:
        clean = tag.strip().lower()
        if clean and clean not in seen:
            seen.add(clean)
            normalized.append(clean[:60])
    return normalized


def get_or_create_tags(db: Session, tag_names: list[str]) -> list[Tag]:
    tags: list[Tag] = []
    for name in normalize_tags(tag_names):
        tag = db.scalar(select(Tag).where(Tag.name == name))
        if tag is None:
            tag = Tag(name=name)
            db.add(tag)
            db.flush()
        tags.append(tag)
    return tags


def create_video(
    db: Session,
    *,
    owner: User,
    title: str,
    description: str,
    category: Category,
    video_path: str,
    thumbnail_path: str,
    tags: list[str],
) -> Video:
    video = Video(
        owner=owner,
        title=title,
        description=description,
        category=category,
        video_path=video_path,
        thumbnail_path=thumbnail_path,
        tags=get_or_create_tags(db, tags),
    )
    db.add(video)
    db.commit()
    db.refresh(video)
    return video


def get_video(db: Session, video_id: int) -> Video | None:
    return db.scalars(_with_video_relations(select(Video).where(Video.id == video_id))).unique().first()


def list_videos(db: Session, *, page: int, page_size: int, category_id: int | None = None) -> tuple[list[Video], int]:
    stmt = select(Video)
    count_stmt = select(func.count(Video.id))
    if category_id:
        stmt = stmt.where(Video.category_id == category_id)
        count_stmt = count_stmt.where(Video.category_id == category_id)
    total = db.scalar(count_stmt) or 0
    videos = db.scalars(
        _with_video_relations(stmt.order_by(Video.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    ).unique().all()
    return list(videos), total


def trending_videos(db: Session, *, limit: int = 12) -> list[Video]:
    return list(
        db.scalars(_with_video_relations(select(Video).order_by(Video.view_count.desc(), Video.created_at.desc()).limit(limit)))
        .unique()
        .all()
    )


def related_videos(db: Session, video: Video, *, limit: int = 8) -> list[Video]:
    return list(
        db.scalars(
            _with_video_relations(
                select(Video)
                .where(Video.id != video.id, Video.category_id == video.category_id)
                .order_by(Video.created_at.desc())
                .limit(limit)
            )
        )
        .unique()
        .all()
    )


def search_videos(db: Session, *, query: str, page: int, page_size: int) -> tuple[list[Video], int]:
    pattern = f"%{query.lower()}%"
    base = select(Video).join(Video.tags, isouter=True).where(
        or_(
            func.lower(Video.title).like(pattern),
            func.lower(Video.description).like(pattern),
            func.lower(Tag.name).like(pattern),
        )
    )
    matching_ids = base.with_only_columns(Video.id).distinct().subquery()
    count = db.scalar(select(func.count()).select_from(matching_ids)) or 0
    videos = db.scalars(
        _with_video_relations(base.order_by(Video.created_at.desc()).offset((page - 1) * page_size).limit(page_size))
    ).unique().all()
    return list(videos), count


def user_videos(db: Session, owner: User) -> list[Video]:
    return list(
        db.scalars(_with_video_relations(select(Video).where(Video.owner_id == owner.id).order_by(Video.created_at.desc())))
        .unique()
        .all()
    )


def update_video(db: Session, video: Video, data: VideoUpdate, category: Category | None) -> Video:
    if data.title is not None:
        video.title = data.title
    if data.description is not None:
        video.description = data.description
    if category is not None:
        video.category = category
    if data.tags is not None:
        video.tags = get_or_create_tags(db, data.tags)
    db.commit()
    db.refresh(video)
    return video


def delete_video(db: Session, video: Video) -> None:
    db.delete(video)
    db.commit()


def record_view(db: Session, video: Video, *, user: User | None, ip_address: str | None, user_agent: str | None) -> Video:
    db.add(View(video=video, user=user, ip_address=ip_address, user_agent=(user_agent or "")[:255]))
    video.view_count += 1
    db.commit()
    db.refresh(video)
    return video
