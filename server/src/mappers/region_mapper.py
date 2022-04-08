from ..DTOs.regions import RegionCreateDTO,RegionUpdateDTO,RegionDTO
from ..models.regions import Region

class RegionMapper:
    def __init__(self) -> None:
        ...
    
    def from_create_to_model(self,dto:RegionCreateDTO)->Region:
        region  = Region()
        region.region_name = dto.region_name
        return region
    
    def from_update_to_model(self,dto:RegionUpdateDTO,region:Region)->Region:
        region.region_id = dto.region_id
        region.region_name = dto.region_name
        return region
    def from_model_to_dto(self,region:Region)->RegionDTO:
        dto = RegionDTO(region_id=region.region_id,region_name=region.region_name)
        return dto




    