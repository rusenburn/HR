from pydantic import BaseModel

class LocationDTO(BaseModel):
    location_id:int
    street_address:str
    postal_code:str|None = None
    city:str
    state_province:str
    country_id : int
