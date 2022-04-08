from pydantic import BaseModel

class RegionDTO(BaseModel):
    region_id: int
    region_name: str

    class Config:
        orm_mode = True
