from pydantic import BaseModel, Field

class CountryUpdateDTO(BaseModel):
    country_id:int = Field(...,alias="countryId")
    country_name:str = Field(...,alias="countryName")
    region_id:int = Field(...,alias="regionId")

    
    class Config:
        allow_population_by_field_name=True
