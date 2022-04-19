from datetime import datetime
from pydantic import BaseModel,Field

class JobHistoryCreate(BaseModel):
    employee_id:int = Field(...,gt=0,alias="employeeId")
    start_date:datetime = Field(...,alias="startDate")
    salary:int = Field(...,ge=0)
    job_id : int |None= Field(...,gt=0,alias="jobId")
    department_id:int |None=Field(...,gt=0,alias="departmentId")

    
    class Config:
        allow_population_by_field_name=True