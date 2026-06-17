from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.crud.users import get_user
from app.db.session import get_db
from app.models.user import User

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    subject = decode_access_token(token)
    if subject is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication credentials.")
    user = get_user(db, int(subject))
    if user is None or not user.is_active:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Inactive or missing user.")
    return user


def get_optional_user(
    token: str | None = Depends(OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)),
    db: Session = Depends(get_db),
) -> User | None:
    if not token:
        return None
    subject = decode_access_token(token)
    if not subject or not subject.isdigit():
        return None
    return get_user(db, int(subject))
