from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.category import Category

CATEGORY_NAMES = ["Technology", "Education", "Gaming", "Entertainment", "Sports", "Music", "Other"]


def slugify(value: str) -> str:
    return value.lower().replace(" ", "-")


def seed_categories(db: Session) -> None:
    existing = {category.name for category in db.scalars(select(Category)).all()}
    for name in CATEGORY_NAMES:
        if name not in existing:
            db.add(Category(name=name, slug=slugify(name)))
    db.commit()


def list_categories(db: Session) -> list[Category]:
    return list(db.scalars(select(Category).order_by(Category.name)).all())


def get_category(db: Session, category_id: int) -> Category | None:
    return db.get(Category, category_id)
