from datetime import datetime
from pydantic import BaseModel

class JobHistoryDTO(BaseModel):
    employee_id:int
    start_date:datetime
    salary:int
    end_date: datetime|None=None
    job_id:int|None = None
    department_id : int|None=None