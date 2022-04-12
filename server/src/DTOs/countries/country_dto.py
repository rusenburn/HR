from typing import TYPE_CHECKING
from pydantic import BaseModel

from ..nested import RegionNested,LocationNested


class CountryDTO(BaseModel):
    country_id :int
    country_name : str
    region_id :int
    region:RegionNested
    locations:list[LocationNested]

    class Config:
        orm_mode = True
