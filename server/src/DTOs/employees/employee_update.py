from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class EmployeeUpdate(BaseModel):
    employee_id: int = Field(...,gt=0)
    first_name: str = Field(..., max_length=52)
    last_name: str = Field(..., max_length=52)
    email: EmailStr = Field(...)
    phone_number: str = Field(..., max_length=52)
    manager_id: int | None
