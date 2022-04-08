from pydantic import BaseModel

class RegionCreateDTO(BaseModel):
    region_name:str