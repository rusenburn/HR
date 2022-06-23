import datetime as dt
from datetime import datetime
import typing
from pydantic import BaseModel, Field, validator

class JobHistoryUpdate(BaseModel):
    employee_id: int = Field(..., gt=0,alias="employeeId")
    start_date: datetime=Field(...,alias="startDate")
    end_date: datetime | None = Field(...,alias="endDate")

    
    class Config:
        allow_population_by_field_name=True

    @validator('end_date')
    def end_date_not_before_start_date(cls, v: datetime, values: dict, **kwargs):
        if v and 'start_date' in values :
            start_date = typing.cast(datetime,values['start_date'])
            start_date = start_date.replace(tzinfo=dt.timezone.utc)
            v = v.replace(tzinfo=dt.timezone.utc)
            if v < start_date:
                raise ValueError('end_date must be bigger than start_date')
            elif v>start_date:
                return v
            else:
                raise ValueError('end_date must be bigger than start_date')
        return v
