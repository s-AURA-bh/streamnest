from app.crud.categories import seed_categories
from app.db.session import Base, SessionLocal, engine
from app.models import Category, Tag, User, Video, View


def init_db() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        seed_categories(db)


if __name__ == "__main__":
    init_db()
