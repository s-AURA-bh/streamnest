from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(80), unique=True, index=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)

    videos = relationship("Video", back_populates="category")
