from pydantic import BaseModel, Field


from ..nested import EmployeeNested,JobHistoryNested, LocationNested

class DepartmentDTO(BaseModel):
    department_id: int = Field(...,alias="departmentId")
    department_name: str = Field(...,alias="departmentName")
    location_id: int = Field(...,alias="locationId")
    location:LocationNested
    employees:list[EmployeeNested]
    job_histories:list[JobHistoryNested] = Field(...,alias="jobHistories")

    
    class Config:
        allow_population_by_field_name=True

