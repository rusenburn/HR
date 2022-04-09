from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class Department(Base):
    __tablename__ = "departments"

    department_id:int = Column(Integer,primary_key=True,index=True)
    department_name:str = Column(String(52),unique=True,nullable=False)

    location_id:int = Column(Integer,ForeignKey("locations.location_id",ondelete="CASCADE"),nullable=False)
    
    location = relationship("Location", back_populates="departments")
    # employees = relationship("Employee",back_populates= "department")
    # job_histories = relationship("JobHistory" ,back_populates="department")