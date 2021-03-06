from DTOs.locations import LocationUpdate, LocationDTO, LocationCreate
from DTOs.nested import LocationNested
from models import Location
from .nested_mapper import NestedMapper

class LocationMapper():
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested

    def from_update_to_model(self, update_dto: LocationUpdate, location: Location) -> Location:
        location.location_id = update_dto.location_id
        location.street_address = update_dto.street_address
        location.postal_code = update_dto.postal_code
        location.city = update_dto.city
        location.state_province = update_dto.state_province
        location.country_id = update_dto.country_id
        return location
    
    def from_create_to_model(self,create_dto:LocationCreate)->Location:
        model = Location()
        model.street_address = create_dto.street_address
        model.postal_code = create_dto.postal_code
        model.city = create_dto.city
        model.state_province = create_dto.state_province
        model.country_id = create_dto.country_id
        return model

    
    def from_model_to_dto(self,location:Location)->LocationDTO:
        dto = LocationDTO(
            location_id=location.location_id,
            street_address=location.street_address,
            postal_code=location.postal_code,
            city=location.city,
            state_province=location.state_province,
            country_id=location.country_id,
            country=self._nested.to_country_nested(location.country),
            departments=list(map(self._nested.to_department_nested,location.departments)))
        return dto
    
    def from_model_to_nested(self,location:Location)->LocationNested:
        return self._nested.to_location_nested(location=location)
