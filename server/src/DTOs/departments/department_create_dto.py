from operator import gt
from pydantic import BaseModel, Field


class DepartmentCreate(BaseModel):
    department_name: str = Field(..., max_length=52)
    location_id: int = Field(..., gt=0)
