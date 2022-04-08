from pydantic import BaseModel

class RegionUpdateDTO(BaseModel):
    region_id : int
    region_name :str