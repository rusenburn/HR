from datetime import datetime
from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime

from ..database import Base
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = "employees"

    employee_id:int = Column(Integer, primary_key=True, index=True)
    first_name :str= Column(String(52),nullable = False)
    last_name :str= Column(String(52),nullable = False)
    email :str= Column(String(52),nullable = False)
    phone_number:str = Column(String(52),nullable = False)
    hire_date :datetime= Column(DateTime)
    salary :int= Column(Integer)

    job_id :int= Column(Integer, ForeignKey("jobs.job_id",ondelete="SET NULL"),index=True)
    job = relationship("Job" , back_populates = "employees")

    manager_id :int= Column(Integer, ForeignKey("employees.employee_id",ondelete="SET NULL"),index=True)
    manager = relationship("Employee" , back_populates = "employees",remote_side=[employee_id])
    employees  = relationship("Employee", back_populates="manager")
    
    department_id :int= Column(Integer, ForeignKey("departments.department_id",ondelete="SET NULL"),index=True)
    department = relationship("Department" , back_populates = "employees")

    
    job_histories = relationship("JobHistory",back_populates="employee")
    # job_histories : list





