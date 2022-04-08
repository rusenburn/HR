from fastapi import APIRouter, Body ,Depends,HTTPException

from ..mappers.region_mapper import RegionMapper
from ..DTOs.regions.region_create_dto import RegionCreateDTO
from ..DTOs.regions.region_update_dto import RegionUpdateDTO
from ..DTOs.regions import RegionDTO
from ..services.unit_of_work import UnitOfWork
from ..dependencies import get_region_mapper, get_unit_of_work

router = APIRouter(
    prefix="/regions",
    tags=["regions"],
    responses={
        404 : {"description":"Not Found"}
    }
)

@router.get("/",response_model=list[RegionDTO])
def get_all(uow:UnitOfWork=Depends(get_unit_of_work),
    region_mapper:RegionMapper=Depends(get_region_mapper)):
    # TODO offset and limit
    regions = uow.regions.get_all()
    region_dtos = [region_mapper.from_Region_to_RegionDTO(r) for r in regions]
    return region_dtos


@router.get("/{region_id}",response_model=RegionDTO)
def get_one(
        region_id:int,
        uow:UnitOfWork=Depends(get_unit_of_work),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = uow.regions.get_one(region_id)
    if region is None:
        raise HTTPException(status_code=404)

    dto = region_mapper.from_Region_to_RegionDTO(region)
    return dto

@router.post("/",response_model=RegionDTO)
def create_one(
        create_dto:RegionCreateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    # TODO map to region instead
    region = region_mapper.from_CREATEDTO_to_Region(create_dto)
    uow.regions.create_one(region)
    uow.commit_refresh([region])
    dto = region_mapper.from_Region_to_RegionDTO(region)
    return dto

@router.put("/",response_model=RegionDTO)
def update_one(
        region_update_dto:RegionUpdateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):
    
    region = uow.regions.get_one(region_update_dto.region_id)
    if region is None:
        raise HTTPException(status_code=404)

    region = region_mapper.from_UpdateDTO_to_Region(region_update_dto,region)
    uow.regions.update_one(region)
    uow.commit_refresh([region])
    region_dto = region_mapper.from_Region_to_RegionDTO(region)
    return region_dto

@router.delete("/{region_id}")
def delete_one(region_id : int ,uow:UnitOfWork=Depends(get_unit_of_work)):
    uow.regions.delete_one(region_id)
    uow.commit_refresh()
