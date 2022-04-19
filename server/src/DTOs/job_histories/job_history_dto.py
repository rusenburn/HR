from datetime import datetime
from pydantic import BaseModel, Field
from sqlalchemy import alias

from ..nested import EmployeeNested, DepartmentNested, JobNested


class JobHistoryDTO(BaseModel):
    employee_id: int = Field(...,alias="employeeId")
    start_date: datetime = Field(...,alias="startDate")
    salary: int 
    end_date: datetime | None = Field(None,alias="endDate")
    job_id: int | None =  Field(None,alias="jobId")
    department_id: int | None = Field(None,alias="departmentId")
    employee: EmployeeNested
    department: DepartmentNested | None = None
    job: JobNested | None = None

    
    class Config:
        allow_population_by_field_name=True
