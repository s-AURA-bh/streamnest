from sqlalchemy import String, Table, Column, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


video_tags = Table(
    "video_tags",
    Base.metadata,
    Column("video_id", ForeignKey("videos.id", ondelete="CASCADE"), primary_key=True),
    Column("tag_id", ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True),
)


class Tag(Base):
    __tablename__ = "tags"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(60), unique=True, index=True, nullable=False)

    videos = relationship("Video", secondary=video_tags, back_populates="tags")
