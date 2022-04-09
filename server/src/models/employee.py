from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime
from ..database import Base
from sqlalchemy.orm import relationship

class Employee(Base):
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String,nullable = False)
    last_name = Column(String,nullable = False)
    email = Column(String,nullable = False)
    phone_number = Column(String,nullable = False)
    hire_date = Column(DateTime,nullable = False)
    salary = Column(Integer,nullable = False)

    job_id = Column(Integer, ForeignKey("jobs.job_id"), nullable = False,index=True)
    manager_id = Column(Integer, ForeignKey("employees.employee_id"),index=True)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable = False,index=True)

    job = relationship("Job" , back_populates = "employees")
    department = relationship("Department" , back_populates = "employees")
    manager = relationship("Employee" , back_populates = "employees",remote_side=[employee_id])

    employees  = relationship("Employee", back_populates="manager")
    job_histories = relationship("Job_History",back_populates="employee")





