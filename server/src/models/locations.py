from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from database import Base
from sqlalchemy.orm import relationship

class Location(Base):
    __tablename__ = "locations"

    location_id = Column(Integer,primary_key=True)
    street_address = Column(String(128),nullable=False)
    postal_code = Column(String(52))
    city = Column(String(52),nullable=False)
    state_province = Column(String(52),nullable=False)

    country_id = Column(Integer,ForeignKey("countries.country_id",ondelete="CASCADE"),nullable=False)

    country = relationship("Country" , back_populates= "locations",lazy="raise")
    departments = relationship("Department" , back_populates="location",lazy="raise")
