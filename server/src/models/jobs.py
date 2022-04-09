from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class Job(Base):
    __tablename__ = "jobs"

    job_id= Column(Integer, primary_key=True, index=True)
    job_title = Column(String,index=True)
    min_salary = Column(Integer)
    max_salary = Column(Integer)

    employees = relationship("Employee", back_populates = "job")
    job_histories = relationship("JobHistory" , back_populates="job")
