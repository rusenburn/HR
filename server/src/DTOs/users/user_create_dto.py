from pydantic import BaseModel, Field

class UserCreateDTO(BaseModel):
    username:str =  Field(...)
    email:str = Field(...) 
    password:str = Field(...)