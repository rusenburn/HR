from pydantic import BaseModel, Field


class LocationCreate(BaseModel):
    street_address: str = Field(..., max_length=128,alias="streetAddress")
    postal_code: str = Field(None, max_length=52,alias="postalCode")
    city: str = Field(..., max_length=52)
    state_province: str = Field(..., max_length=52,alias="stateProvince")
    country_id: int = Field(..., gt=0,alias="countryId")
    
    class Config:
        allow_population_by_field_name=True
