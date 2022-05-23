from sqlalchemy.orm import Session
from ..models import User


class UsersService:
    def __init__(self,db:Session) -> None:
        self._db :Session = db
    
    def get_one(self,user_id:str)->User:
        return self._db.query(User).filter(User.user_id == user_id).first()
    
    def get_one_by_username(self,username:str)->User:
        return self._db.query(User).filter(User.username == username).first()
    
    def create_one(self,user:User)->None:
        # TODO remove this admin logic
        if self.get_users_count() == 0:
            user.admin = True
        self._db.add(user)
    
    def get_users_count(self)->int:
        return self._db.query(User).count()
    
