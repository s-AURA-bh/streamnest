from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.core.security import create_access_token
from app.crud.users import authenticate_user, create_user, get_user_by_email, get_user_by_username
from app.db.session import get_db
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register(payload: UserCreate, db: Session = Depends(get_db)) -> UserRead:
    if get_user_by_email(db, payload.email):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email is already registered.")
    if get_user_by_username(db, payload.username):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Username is already taken.")
    return create_user(db, payload)


@router.post("/login", response_model=Token)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)) -> Token:
    user = authenticate_user(db, form.username, form.password)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password.")
    return Token(access_token=create_access_token(str(user.id)))
