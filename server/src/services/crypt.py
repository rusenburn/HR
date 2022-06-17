from passlib.hash import bcrypt
from passlib.context import CryptContext
from models.users import User

pwd_context = CryptContext(schemes=[bcrypt],deprecated="auto")

class CryptService:
    def __init__(self) -> None:
        ...
    
    def verify_password(self,plain_password:str,hashed_password:str)->bool:
        return pwd_context.verify(plain_password,hashed_password)
    
    def get_password_hash(self,password:str)->str:
        return pwd_context.hash(password)
    
    def is_authenticated_user(self,user:User,password:str)->bool:
        return self.verify_password(password,user.hashed_password)