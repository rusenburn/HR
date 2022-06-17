from DTOs.regions import RegionCreateDTO,RegionUpdateDTO,RegionDTO
from DTOs.nested import RegionNested
from models.regions import Region
from .nested_mapper import NestedMapper

class RegionMapper:
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested
    
    def from_create_to_model(self,dto:RegionCreateDTO)->Region:
        region  = Region()
        region.region_name = dto.region_name
        return region
    
    def from_update_to_model(self,dto:RegionUpdateDTO,region:Region)->Region:
        region.region_id = dto.region_id
        region.region_name = dto.region_name
        return region
    def from_model_to_dto(self,region:Region)->RegionDTO:
        dto = RegionDTO(
            region_id=region.region_id,
            region_name=region.region_name,
            countries=list(map(self._nested.to_country_nested,region.countries)))
        return dto
    
    def from_model_to_nested(self,region:Region)->RegionNested:
        return self._nested.to_region_nested(region)