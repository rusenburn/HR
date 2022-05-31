from pydantic import BaseModel, Field

class TokenDTO(BaseModel):
    access_token:str = Field(...,alias="accessToken")
    token_type:str = Field(...,alias="tokenType")
    # access_token:str = Field(...)
    # token_type:str = Field(...)
    class Config:
        allow_population_by_field_name= True
