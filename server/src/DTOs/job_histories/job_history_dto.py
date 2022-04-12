from datetime import datetime
from pydantic import BaseModel

from ..nested import EmployeeNested, DepartmentNested, JobNested


class JobHistoryDTO(BaseModel):
    employee_id: int
    start_date: datetime
    salary: int
    end_date: datetime | None = None
    job_id: int | None = None
    department_id: int | None = None
    employee: EmployeeNested
    department: DepartmentNested | None = None
    job: JobNested | None = None
