from datetime import datetime, timedelta
from typing import Any
from jose import jwt, JWTError

ACCESS_TOKEN_EXPIRE_MINUTES = 30
ALGORITHM = "HS256"
SECRET_KEY = ""


class JwtContainer:
    '''
    This is an object that contains Jwt information after being decoded
    can be used to check if user is logged, the username and admin status
    '''
    def __init__(self, payload: dict[str, Any]) -> None:
        self._payload: dict[str, Any] = payload

    @property
    def username(self) -> str:
        if self._payload and "sub" in self._payload:
            return self._payload["sub"]
        return ""

    @property
    def admin(self)->bool:
        if self._payload and "admin" in self._payload:
            return self._payload["admin"]
        return False

class JwtService():
    def create_access_token(self, data: dict, expires_delta: timedelta | None = None)->str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow()+expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=30)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    def get_current_user(self, token: str) -> str | None:
        try:
            payload: dict[str, Any] = jwt.decode(
                token, SECRET_KEY, algorithms=[ALGORITHM])
        except JWTError:
            return None
        username: str = payload.get("sub")
        return username

    def build_jwt_container(self, token: str) -> JwtContainer:
        try:
            payload: dict[str, Any] = jwt.decode(
                token, SECRET_KEY, algorithms=[ALGORITHM])
            return JwtContainer(payload)
        except:
            return JwtContainer(None)
        




    
