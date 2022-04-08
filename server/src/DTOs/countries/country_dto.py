from pydantic import BaseModel

class CountryDTO(BaseModel):
    country_id :int
    country_name : str
    region_id :int

    class Config:
        orm_mode = True
