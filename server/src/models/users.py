from tokenize import String
import sqlalchemy as sa
from database import Base
import uuid

def generate_uuid()->str:
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"
    user_id : str = sa.Column(sa.String(64),primary_key = True,unique = True,default = generate_uuid)
    username :str=  sa.Column(sa.String(64),unique=True,nullable=False)
    email :str = sa.Column(sa.String(64),unique=True,nullable=False)
    hashed_password:str = sa.Column(sa.String(64),nullable=False)
    disabled:bool = sa.Column(sa.Boolean,default=False)
    admin:bool = sa.Column(sa.Boolean,default=False)