from pydantic import BaseModel, EmailStr
from datetime import datetime

class CountryNested(BaseModel):
    country_id :int
    country_name : str
    region_id :int

class DepartmentNested(BaseModel):
    department_id: int
    department_name: str
    location_id: int


class JobHistoryNested(BaseModel):
    employee_id:int
    start_date:datetime
    salary:int
    end_date: datetime | None = None
    job_id:int|None = None
    department_id : int|None=None

class JobNested(BaseModel):
    job_id : int
    job_title:str
    min_salary : int
    max_salary : int


class EmployeeNested(BaseModel):
    employee_id :int
    first_name:str
    last_name:str
    email:EmailStr
    phone_number:str
    hire_date: datetime|None = None
    salary:int | None

    job_id:int|None
    manager_id:int|None
    department_id:int|None

class LocationNested(BaseModel):
    location_id:int
    street_address:str
    postal_code:str|None = None
    city:str
    state_province:str
    country_id : int

class RegionNested(BaseModel):
    region_id: int
    region_name: str

    class Config:
        orm_mode = True