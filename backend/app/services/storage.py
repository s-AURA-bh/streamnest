from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile, status

from app.core.config import get_settings


VIDEO_CONTENT_TYPES = {"video/mp4"}
IMAGE_CONTENT_TYPES = {"image/jpeg", "image/png", "image/webp"}


def ensure_upload_dirs() -> None:
    settings = get_settings()
    Path(settings.upload_dir, "videos").mkdir(parents=True, exist_ok=True)
    Path(settings.upload_dir, "thumbnails").mkdir(parents=True, exist_ok=True)


def public_url(relative_path: str) -> str:
    settings = get_settings()
    return f"{str(settings.media_base_url).rstrip('/')}/{relative_path.lstrip('/')}"


async def save_upload(file: UploadFile, *, kind: str) -> str:
    settings = get_settings()
    ensure_upload_dirs()
    is_video = kind == "videos"
    allowed = VIDEO_CONTENT_TYPES if is_video else IMAGE_CONTENT_TYPES
    limit_mb = settings.max_video_size_mb if is_video else settings.max_thumbnail_size_mb

    if file.content_type not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid {kind[:-1]} file type.",
        )

    suffix = Path(file.filename or "").suffix.lower()
    if is_video and suffix != ".mp4":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Only MP4 videos are supported.")
    if not is_video and suffix not in {".jpg", ".jpeg", ".png", ".webp"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported thumbnail extension.")

    relative_path = f"{kind}/{uuid4().hex}{suffix}"
    destination = Path(settings.upload_dir, relative_path)
    max_bytes = limit_mb * 1024 * 1024
    written = 0

    with destination.open("wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            written += len(chunk)
            if written > max_bytes:
                destination.unlink(missing_ok=True)
                raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail=f"File exceeds {limit_mb} MB.")
            buffer.write(chunk)

    return relative_path
