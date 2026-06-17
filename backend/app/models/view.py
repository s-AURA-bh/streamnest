from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class View(Base):
    __tablename__ = "views"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    video_id: Mapped[int] = mapped_column(ForeignKey("videos.id", ondelete="CASCADE"), index=True)
    user_id: Mapped[int | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    ip_address: Mapped[str | None] = mapped_column(String(80))
    user_agent: Mapped[str | None] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)

    video = relationship("Video", back_populates="views")
    user = relationship("User", back_populates="views")
