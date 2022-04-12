from datetime import datetime
from pydantic import BaseModel, Field, validator


class JobHistoryUpdate(BaseModel):
    employee_id: int = Field(..., gt=0)
    start_date: datetime
    end_date: datetime | None = None

    @validator('end_date')
    def max_salary_not_smaller_than_min_salary(cls, v: int, values: dict, **kwargs):
        if v and 'start_date' in values and v < values['start_date']:
            raise ValueError('max_salary must be bigger than min_salary')
        return v
