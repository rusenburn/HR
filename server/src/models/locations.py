from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

# class Location(Base):
#     __tablename__ = "locations"

#     location_id = Column(Integer,primary_key=True)
#     street_address = Column(String(128),)
#     postal_code = Column(String(52),)
#     city = Column(String(52),)
#     state_province = Column(String(52))

#     country_id = Column(Integer,ForeignKey("countries.country_id"),nullable=False)

#     country = relationship("Country" , back_populates= "locations")
#     departments = relationship("Department" , back_populates="location")
