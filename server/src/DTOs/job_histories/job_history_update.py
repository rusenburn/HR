from datetime import datetime
from pydantic import BaseModel, Field, validator


class JobHistoryUpdate(BaseModel):
    employee_id: int = Field(..., gt=0,alias="employeeId")
    start_date: datetime=Field(...,alias="startDate")
    end_date: datetime | None = Field(...,alias="endDate")

    
    class Config:
        allow_population_by_field_name=True

    @validator('end_date')
    def max_salary_not_smaller_than_min_salary(cls, v: int, values: dict, **kwargs):
        if v and 'start_date' in values :
            start_date = values['start_date']
            if v < start_date:
                raise ValueError('max_salary must be bigger than min_salary')
        return v
