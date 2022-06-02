from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
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


# DATABASE_URL = "sqlite:///./sql_app.db"
DATABASE_URL = f"mysql+pymysql://root:{DB_PASSWORD}@{DB_SERVER}/{DB_NAME}"
print(DATABASE_URL)
# DATABASE_URL = "sqlite:///:memory:"
# DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(DATABASE_URL,pool_recycle=3600)

SessionFactory = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()