from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class Country(Base):
    __tablename__ = "countries"
    
    country_id = Column(Integer,primary_key=True,index=True)
    country_name = Column(String(64),unique=True,nullable=False)
    
    region_id = Column(Integer,ForeignKey("regions.region_id",ondelete="CASCADE"),nullable=False)

    region = relationship("Region",back_populates="countries",foreign_keys=region_id,lazy="raise")
    locations = relationship("Location" , back_populates="country",lazy="raise")
    