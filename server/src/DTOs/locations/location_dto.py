from pydantic import BaseModel, Field

from ..nested import DepartmentNested,CountryNested

class LocationDTO(BaseModel):
    location_id:int = Field(...,alias="locationId")
    street_address:str = Field(...,alias="streetAddress")
    postal_code:str|None = Field(None,alias="postalCode")
    city:str
    state_province:str  =Field(None,alias="stateProvince")
    country_id : int = Field(...,alias="countryId")
    country:CountryNested 
    departments:list[DepartmentNested]
    
    class Config:
        allow_population_by_field_name=True
