from ..DTOs.regions import RegionCreateDTO,RegionUpdateDTO,RegionDTO
from ..models.regions import Region

class RegionMapper:
    def __init__(self) -> None:
        ...
    
    def from_CREATEDTO_to_Region(self,dto:RegionCreateDTO)->Region:
        region  = Region()
        region.region_name = dto.region_name
        return region
    
    def from_UpdateDTO_to_Region(self,dto:RegionUpdateDTO,region:Region)->Region:
        region.region_id = dto.region_id
        region.region_name = dto.region_name
        return region
    def from_Region_to_RegionDTO(self,region:Region)->RegionDTO:
        dto = RegionDTO(region_id=region.region_id,region_name=region.region_name)
        return dto




    