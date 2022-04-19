from pydantic import BaseModel, EmailStr, Field


class EmployeeUpdate(BaseModel):
    employee_id: int = Field(...,gt=0,alias="employeeId")
    first_name: str = Field(..., max_length=52,alias="firstName")
    last_name: str = Field(..., max_length=52,alias="lastName")
    email: EmailStr = Field(...)
    phone_number: str = Field(..., max_length=52,alias="phoneNumber")
    manager_id: int | None = Field(...,alias="managerId")

    
    class Config:
        allow_population_by_field_name=True