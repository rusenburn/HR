from datetime import datetime
from pydantic import BaseModel,Field

class JobHistoryCreate(BaseModel):
    employee_id:int = Field(...,gt=0)
    start_date:datetime
    salary:int = Field(...,ge=0)
    job_id : int |None= Field(...,gt=0)
    department_id:int |None=Field(...,gt=0)