from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class JobHistory(Base):
    __tablename__ = "job_histories"
    
    employee_id = Column(Integer,primary_key=True,index=True)
    start_date = Column(DateTime,primary_key=True)
    end_date = Column(DateTime)

    job_id = Column(Integer,ForeignKey("jobs.job_id"),nullable = False)
    department_id = Column(Integer,ForeignKey("departments.department_id"),nullable = False)

    job = relationship("Job",back_populates="job_history")
    department = relationship("Department" , back_populates = "job_histories")
    employee = relationship("Employee" , back_populates = "job_histories")




