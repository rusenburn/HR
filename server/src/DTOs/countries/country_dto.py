from typing import TYPE_CHECKING
from pydantic import BaseModel, Field

from ..nested import RegionNested,LocationNested


class CountryDTO(BaseModel):
    country_id :int = Field(...,alias="countryId")
    country_name : str = Field(...,alias="countryName")
    region_id :int = Field(...,alias="regionId")
    region:RegionNested
    locations:list[LocationNested]

    
    class Config:
        allow_population_by_field_name=True
