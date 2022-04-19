from pydantic import BaseModel, Field


class DepartmentUpdate(BaseModel):
    department_id: int = Field(...,gt=0,alias="departmentId")
    department_name: str = Field(..., max_length=52,alias="departmentName")
    location_id: int = Field(..., gt=0,alias="locationId")

    
    class Config:
        allow_population_by_field_name=True
