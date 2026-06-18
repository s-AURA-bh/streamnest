from functools import lru_cache

from pydantic import AnyHttpUrl, Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "StreamNest"
    environment: str = "development"
    secret_key: str = Field(min_length=32)
    access_token_expire_minutes: int = 60 * 24
    database_url: str
    backend_cors_origins: str = "http://localhost:3000"
    media_base_url: AnyHttpUrl = "https://streamnest-hdup.onrender.com/media"
    upload_dir: str = "uploads"
    max_video_size_mb: int = 500
    max_thumbnail_size_mb: int = 10

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.backend_cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()
