from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "sqlite:///./sql_app.db"
# DATABASE_URL = "sqlite:///:memory:"
# DATABASE_URL = "postgresql://user:password@postgresserver/db"

engine = create_engine(DATABASE_URL,connect_args={"check_same_thread":False})

SessionFactory = sessionmaker(autocommit=False,autoflush=False,bind=engine)

Base = declarative_base()