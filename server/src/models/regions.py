from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from sqlalchemy.orm import relationship
from ..database import Base

class Region(Base):
    __tablename__ = "regions"

    region_id = Column(Integer,primary_key=True,index=True)
    region_name = Column(String(64),nullable =False)

    countries = relationship("Country",back_populates="region",lazy="raise")