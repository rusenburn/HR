from .nested_mapper import NestedMapper
from ..DTOs.countries import CountryDTO,CountryCreateDTO,CountryUpdateDTO
from ..models import Country


class CountryMapper:
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested

    def from_model_to_dto(self,country:Country)->CountryDTO:
        dto = CountryDTO(
            country_id=country.country_id,
            country_name=country.country_name,
            region_id=country.region_id,
            region=self._nested.to_region_nested(country.region),
            locations=list(map(self._nested.to_location_nested,country.locations)))
            
        return dto

    def from_create_to_model(self,create_dto:CountryCreateDTO)->Country:
        model = Country()
        model.country_name = create_dto.country_name
        model.region_id  = create_dto.region_id
        return model


    def from_update_to_model(self,update_dto:CountryUpdateDTO,country:Country)->Country:
        country.country_name = update_dto.country_name
        country.region_id = update_dto.region_id
        return country