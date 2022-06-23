from datetime import datetime
from pydantic import BaseModel,Field
import datetime as dt
class JobHistoryCreate(BaseModel):
    employee_id:int = Field(...,gt=0,alias="employeeId")
    start_date:datetime = Field(...,alias="startDate")
    salary:int = Field(...,ge=0)
    job_id : int |None= Field(...,gt=0,alias="jobId")
    department_id:int |None=Field(...,gt=0,alias="departmentId")

    @property
    def start_date_utc(self):
        return self.start_date.astimezone(dt.timezone.utc)
    
    @property
    def start_date_none(self):
        return self.start_date.astimezone(None)
    @property
    def start_date__(self):
        return self.start_date.replace(tzinfo=None)
    class Config:
        allow_population_by_field_name=True