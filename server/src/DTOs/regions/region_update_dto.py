from pydantic import BaseModel, Field

class RegionUpdateDTO(BaseModel):
    region_id : int = Field(...,alias="regionId")
    region_name :str = Field(...,alias="regionName")
    class Config:
        allow_population_by_field_name=True