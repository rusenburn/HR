from pydantic import BaseModel, Field, EmailStr


class UserCreateDTO(BaseModel):
    username: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
