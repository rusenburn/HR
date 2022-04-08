from pydantic import BaseModel

class CountryCreateDTO(BaseModel):
    country_name:str
    region_id:int