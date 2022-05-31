from fastapi import APIRouter, Body ,Depends,HTTPException


from ..mappers.region_mapper import RegionMapper
from ..mappers.nested_mapper import NestedMapper
from ..DTOs.nested import RegionNested
from ..DTOs.regions import RegionDTO
from ..DTOs.regions.region_create_dto import RegionCreateDTO
from ..DTOs.regions.region_update_dto import RegionUpdateDTO
from ..services.unit_of_work import UnitOfWork
from ..dependencies import get_base_query, get_region_mapper, get_unit_of_work, require_admin_user

router = APIRouter(
    prefix="/regions",
    tags=["regions"],
    responses={
        404 : {"description":"Not Found"}
    },
    dependencies=[
        Depends(require_admin_user)
        ],
)

@router.get("/",response_model=list[RegionNested])
def get_all(uow:UnitOfWork=Depends(get_unit_of_work),
    region_mapper:RegionMapper=Depends(get_region_mapper),
    query=Depends(get_base_query)):
    # TODO offset and limit
    regions = uow.regions.get_all(**query)
    region_dtos = [region_mapper.from_model_to_nested(r) for r in regions]
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

    dto = region_mapper.from_model_to_dto(region)
    return dto

@router.post("/",response_model=RegionNested)
def create_one(
        create_dto:RegionCreateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = region_mapper.from_create_to_model(create_dto)
    uow.regions.create_one(region)
    uow.commit_refresh([region])
    dto = region_mapper.from_model_to_nested(region)
    return dto

@router.put("/",response_model=RegionNested)
def update_one(
        region_update_dto:RegionUpdateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):
    
    region = uow.regions.get_one(region_update_dto.region_id)
    if region is None:
        raise HTTPException(status_code=404)

    region = region_mapper.from_update_to_model(region_update_dto,region)
    uow.regions.update_one(region)
    uow.commit_refresh([region])
    region_dto = region_mapper.from_model_to_nested(region)
    return region_dto

@router.delete("/{region_id}",status_code=204)
def delete_one(region_id : int ,uow:UnitOfWork=Depends(get_unit_of_work)):
    model = uow.regions.get_one(region_id)
    if model is None:
        raise HTTPException(status_code=404)
    uow.regions.delete_one(region_id)
    uow.commit_refresh()
