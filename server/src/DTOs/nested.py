from pydantic import BaseModel, EmailStr, Field
from datetime import datetime


class CountryNested(BaseModel):
    country_id: int = Field(..., alias="countryId")
    country_name: str = Field(..., alias="countryName")
    region_id: int = Field(..., alias="regionId")

    class Config:
        allow_population_by_field_name = True


class DepartmentNested(BaseModel):
    department_id: int = Field(..., alias="departmentId")
    department_name: str = Field(..., alias="departmentName")
    location_id: int = Field(..., alias="locationId")

    class Config:
        allow_population_by_field_name = True


class JobHistoryNested(BaseModel):
    employee_id: int = Field(..., alias="employeeId")
    start_date: datetime = Field(..., alias="startDate")
    salary: int
    end_date: datetime | None = Field(None, alias="endDate")
    job_id: int | None = Field(None, alias="jobId")
    department_id: int | None = Field(None, alias="departmentId")

    class Config:
        allow_population_by_field_name = True


class JobNested(BaseModel):
    job_id: int = Field(..., alias="jobId")
    job_title: str = Field(..., alias="jobTitle")
    min_salary: int = Field(..., alias="minSalary")
    max_salary: int = Field(..., alias="maxSalary")

    class Config:
        allow_population_by_field_name = True


class EmployeeNested(BaseModel):
    employee_id: int = Field(..., alias="employeeId")
    first_name: str = Field(..., alias="firstName")
    last_name: str = Field(..., alias="lastName")
    email: EmailStr
    phone_number: str = Field(..., alias="phoneNumber")
    hire_date: datetime | None = Field(None, alias="hireDate")
    salary: int | None

    job_id: int | None = Field(None, alias="jobId")
    manager_id: int | None = Field(None, alias="managerId")
    department_id: int | None = Field(None, alias="departmentId")

    class Config:
        allow_population_by_field_name = True


class LocationNested(BaseModel):
    location_id: int = Field(..., alias="locationId")
    street_address: str = Field(..., alias="streetAddress")
    postal_code: str | None = Field(None, alias="postalCode")
    city: str
    state_province: str = Field(..., alias="stateProvince")
    country_id: int = Field(..., alias="countryId")

    class Config:
        allow_population_by_field_name = True


class RegionNested(BaseModel):
    region_id: int = Field(..., alias="regionId")
    region_name: str = Field(..., alias="regionName")

    class Config:
        orm_mode = True
        # alias_generator= lambda x:camel.case(x)
        allow_population_by_field_name = True
