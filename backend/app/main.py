from fastapi import FastAPI
from app.db.session import Base, engine
from app.models.user import User
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.routers import auth, categories, health, users, videos
from app.core.config import get_settings
from app.services.storage import ensure_upload_dirs

settings = get_settings()
ensure_upload_dirs()
Base.metadata.create_all(bind=engine)


app = FastAPI(title=settings.app_name, version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/media", StaticFiles(directory=settings.upload_dir), name="media")

app.include_router(health.router, prefix="/api")
app.include_router(auth.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(categories.router, prefix="/api")
app.include_router(videos.router, prefix="/api")
