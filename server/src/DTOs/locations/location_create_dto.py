from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    street_address: str = Field(..., max_length=128)
    postal_code: str = Field(None, max_length=52)
    city: str = Field(..., max_length=52)
    state_province: str = Field(..., max_length=52)
    country_id: int = Field(..., gt=0)
