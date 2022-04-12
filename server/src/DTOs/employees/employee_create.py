from pydantic import BaseModel,EmailStr,Field

class EmployeeCreate(BaseModel):
    first_name:str = Field(...,max_length=52)
    last_name:str = Field(...,max_length=52)
    email:EmailStr = Field(...)
    phone_number:str = Field(...,max_length=52)