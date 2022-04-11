from datetime import datetime
from pydantic import BaseModel, Field
class JobHistoryEnd(BaseModel):
    employee_id:int =Field(...,gt=0)
    end_date:datetime
