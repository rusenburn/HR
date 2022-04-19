from pydantic import BaseModel, Field
class RegionCreateDTO(BaseModel):
    region_name:str = Field(...,alias="regionName")
    class Config:
        allow_population_by_field_name=True
