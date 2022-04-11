from datetime import datetime
from pydantic import BaseModel,EmailStr

class EmployeeDTO(BaseModel):
    employee_id :int
    first_name:str
    last_name:str
    email:EmailStr
    phone_number:str
    hire_date:datetime | None
    salary:int | None

    job_id:int|None
    manager_id:int|None
    department_id:int|None
