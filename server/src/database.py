from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import create_async_engine,AsyncSession
import os

DB_PASSWORD = "my-secret-pw"
DB_NAME = "db"
DB_SERVER= "localhost"

if "DB_PASSWORD" in os.environ:
    DB_PASSWORD = os.environ["DB_PASSWORD"]
    print("Using Environment Password")
if "DB_NAME" in os.environ:
    DB_NAME = os.environ["DB_NAME"]
    print("Using Environment db")
if "DB_SERVER" in os.environ:
    DB_SERVER = os.environ["DB_SERVER"]


DATABASE_URL = f"mysql+pymysql://root:{DB_PASSWORD}@{DB_SERVER}/{DB_NAME}"
ASYNC_DATABASE_URL = f"mysql+asyncmy://root:{DB_PASSWORD}@{DB_SERVER}/{DB_NAME}"
print(DATABASE_URL)
print(ASYNC_DATABASE_URL)

engine = create_engine(DATABASE_URL,pool_recycle=3600)

SessionFactory = sessionmaker(autocommit=False,autoflush=False,bind=engine)

async_engine = create_async_engine(ASYNC_DATABASE_URL,pool_recycle=3600,future=True,echo=False)
AsyncSessionFactory = sessionmaker(
    bind=async_engine,
    autocommit=False,
    autoflush=False,
    expire_on_commit=False,
    class_=AsyncSession)

Base = declarative_base()