from models import Region
from DTOs.regions import RegionCreateDTO,RegionDTO,RegionUpdateDTO
from DTOs.nested import RegionNested

class Factory:
    def __init__(self) -> None:
        self._current_region_id = 0
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