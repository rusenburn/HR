from pydantic import BaseModel

class CountryUpdateDTO(BaseModel):
    country_id:int
    country_name:str
    region_id:int
