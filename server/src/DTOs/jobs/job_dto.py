from pydantic import BaseModel,Field,validator,ValidationError

from ..nested import EmployeeNested,JobHistoryNested

class JobDTO(BaseModel):
    job_id : int
    job_title:str
    min_salary : int
    max_salary : int
    employees:list[EmployeeNested]
    job_histories:list[JobHistoryNested]