from datetime import datetime
from sqlalchemy import Boolean,Column,ForeignKey,Integer,String,DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class JobHistory(Base):
    __tablename__ = "job_histories"
    
    employee_id:int = Column(Integer,ForeignKey("employees.employee_id",ondelete="CASCADE"), primary_key=True,index=True)
    employee = relationship("Employee" , back_populates = "job_histories")

    start_date:datetime = Column(DateTime,primary_key=True,nullable = False)
    salary:int =Column(Integer,nullable = False)
    end_date :datetime= Column(DateTime)

    department_id :int= Column(Integer,ForeignKey("departments.department_id",ondelete="SET NULL"))
    job_id :int= Column(Integer,ForeignKey("jobs.job_id",ondelete="SET NULL"))

    department = relationship("Department" , back_populates = "job_histories",lazy="raise")
    job = relationship("Job",back_populates="job_histories",lazy="raise")
    




