from pydantic import BaseModel, Field


class DepartmentDTO(BaseModel):
    department_id: int
    department_name: str
    location_id: int
