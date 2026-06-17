from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.crud.categories import list_categories
from app.db.session import get_db
from app.schemas.category import CategoryRead

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryRead])
def categories(db: Session = Depends(get_db)) -> list[CategoryRead]:
    return list_categories(db)
