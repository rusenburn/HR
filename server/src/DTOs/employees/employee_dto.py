from datetime import datetime
from pydantic import BaseModel,EmailStr

from ..nested import DepartmentNested,EmployeeNested,JobHistoryNested,JobNested

class EmployeeDTO(BaseModel):
    employee_id :int
    first_name:str
    last_name:str
    email:EmailStr
    phone_number:str
    hire_date:datetime|None = None
    salary:int | None

    job_id:int|None
    manager_id:int|None =None
    department_id:int|None=None

    manager:EmployeeNested|None
    employees:list[EmployeeNested]
    department : DepartmentNested|None=None
    job:JobNested|None = None
    job_histories:list[JobHistoryNested]

