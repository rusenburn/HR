from pydantic import BaseModel

from ..nested import CountryNested

class RegionDTO(BaseModel):
    region_id: int
    region_name: str
    countries: list[CountryNested]

    class Config:
        orm_mode = True
