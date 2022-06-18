from models import Region,Country
from DTOs.regions import RegionCreateDTO,RegionDTO,RegionUpdateDTO
from DTOs.countries import CountryCreateDTO,CountryDTO,CountryUpdateDTO
from DTOs.nested import RegionNested,CountryNested


class Factory:
    def __init__(self) -> None:
        self._current_region_id = 0
        self._current_country_id = 0
    def make_region(self)->Region:
        self._current_region_id+=1
        region =Region()
        region.region_name = "Asia"
        region.region_id = self._current_region_id
        region.countries = []
        return region

    def make_region_create_dto(self)->RegionCreateDTO:
        return RegionCreateDTO(regionName="Asia")

    def make_region_update_dto(self)->RegionUpdateDTO:
        return RegionUpdateDTO(regionId=1,regionName="Middle East")

    def make_region_dto(self)->RegionDTO:
        return RegionDTO(regionId=1,regionName="Asia",countries=[])
    
    def make_region_nested(self)->RegionNested:
        self._current_region_id+=1
        return RegionNested(regionId=self._current_region_id,regionName=f"region_{self._current_region_id}")
    
    def make_country(self)->Country:
        self._current_country_id+=1
        country = Country()
        country.country_id = self._current_country_id
        country.country_name = f"country_{self._current_country_id}"
        country.region_id = 0
        country.region = None
        country.locations = []
        return country
    
    def make_country_create_dto(self)->CountryCreateDTO:
        return CountryCreateDTO(countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)
    
    
    def make_country_dto(self)->CountryDTO:
        nested_region = self.make_region_nested()
        return CountryDTO(countryId=self._current_country_id,countryName=f'country_{self._current_country_id}',regionId=nested_region.region_id,region=nested_region,locations=[])
    
    def make_country_update_dto(self)->CountryUpdateDTO:
        return CountryUpdateDTO(countryId=self._current_country_id,countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)
    
    def make_country_nested(self)->CountryNested:
        return CountryNested(countryId=self._current_country_id,countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)