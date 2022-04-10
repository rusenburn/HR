from pydantic import BaseModel,Field,validator,ValidationError


class JobDTO(BaseModel):
    job_id : int
    job_title:str
    min_salary : int
    max_salary : int