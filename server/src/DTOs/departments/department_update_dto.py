from pydantic import BaseModel, Field


class DepartmentUpdate(BaseModel):
    department_id: int = Field(...,gt=0)
    department_name: str = Field(..., max_length=52)
    location_id: int = Field(..., gt=0)
