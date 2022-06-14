from sqlalchemy.orm import Session,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import update,delete,func
from sqlalchemy.future import select
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
    

class UsersAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db
    
    async def get_one_async(self,user_id:str)->User:
        q: Query = select(User)
        q = q.filter(User.user_id == user_id)

        results = await self._db.execute(q)
        return results.scalars().first()
    
    async def get_one_by_username_async(self,username:str)->User:
        q:Query = select(User)
        q = q.filter(User.username == username)
        results = await self._db.execute(q)
        return results.scalars().first()
    
    async def create_one_async(self,user:User)->None:
        self._db.add(user)
    
    async def get_users_count_async(self)->int:
        q:Query = select(func.count(User.user_id).label("count"))
        result = await self._db.execute(q)
        return result.scalar()
