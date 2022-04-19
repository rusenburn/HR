from pydantic import BaseModel,Field,validator,ValidationError

from ..nested import EmployeeNested,JobHistoryNested

class JobDTO(BaseModel):
    job_id : int = Field(...,alias="jobId")
    job_title:str = Field(...,alias="jobTitle")
    min_salary : int = Field(...,alias="minSalary")
    max_salary : int = Field(...,alias="maxSalary")
    employees:list[EmployeeNested] 
    job_histories:list[JobHistoryNested] = Field(...,alias="jobHistories")

    
    class Config:
        allow_population_by_field_name=True