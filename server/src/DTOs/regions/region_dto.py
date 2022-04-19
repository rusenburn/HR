from pydantic import BaseModel, Field

from ..nested import CountryNested

class RegionDTO(BaseModel):
    region_id: int = Field(...,alias="regionId")
    region_name: str = Field(...,alias="regionName")
    countries: list[CountryNested]

    class Config:
        orm_mode = True
        allow_population_by_field_name=True
