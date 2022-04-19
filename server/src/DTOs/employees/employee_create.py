from pydantic import BaseModel,EmailStr,Field

class EmployeeCreate(BaseModel):
    first_name:str = Field(...,max_length=52,alias="firstName")
    last_name:str = Field(...,max_length=52,alias="lastName")
    email:EmailStr = Field(...)
    phone_number:str = Field(...,max_length=52,alias="phoneNumber")

    
    class Config:
        allow_population_by_field_name=True