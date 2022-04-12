from pydantic import BaseModel


from ..nested import EmployeeNested,JobHistoryNested

class DepartmentDTO(BaseModel):
    department_id: int
    department_name: str
    location_id: int
    employees:list[EmployeeNested]
    job_histories:list[JobHistoryNested]

