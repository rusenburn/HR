from datetime import datetime
from pydantic import BaseModel,EmailStr, Field

from ..nested import DepartmentNested,EmployeeNested,JobHistoryNested,JobNested

class EmployeeDTO(BaseModel):
    employee_id :int = Field(...,alias="employeeId")
    first_name:str = Field(...,alias="firstName")
    last_name:str = Field(...,alias="lastName")
    email:EmailStr 
    phone_number:str = Field(...,alias="phoneNumber")
    hire_date:datetime|None = Field(None,alias="hireDate")
    salary:int | None

    job_id:int|None = Field(None,alias="jobId")
    manager_id:int|None =Field(None,alias="managerId")
    department_id:int|None=Field(None,alias="departmentId")

    manager:EmployeeNested|None
    employees:list[EmployeeNested]
    department : DepartmentNested|None=None
    job:JobNested|None = None
    job_histories:list[JobHistoryNested] = Field(...,alias="jobHistories")

    
    class Config:
        allow_population_by_field_name=True

