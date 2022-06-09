import asyncio
from fastapi import APIRouter, Body ,Depends,HTTPException


from ..mappers.region_mapper import RegionMapper
from ..mappers.nested_mapper import NestedMapper
from ..DTOs.nested import RegionNested
from ..DTOs.regions import RegionDTO
from ..DTOs.regions.region_create_dto import RegionCreateDTO
from ..DTOs.regions.region_update_dto import RegionUpdateDTO
from ..services.unit_of_work import UnitOfWork,UnitOfWork0
from ..dependencies import get_unit_of_work_async, get_base_query, get_region_mapper, get_unit_of_work, require_admin_user

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
async def get_all(
    uow:UnitOfWork0=Depends(get_unit_of_work_async),
    region_mapper:RegionMapper=Depends(get_region_mapper),
    query=Depends(get_base_query)
    ):
    regions = await uow.regions.get_all_async(**query)
    region_dtos = [region_mapper.from_model_to_nested(r) for r in regions]
    return region_dtos


@router.get("/{region_id}",response_model=RegionDTO)
async def get_one(
        region_id:int,
        uow:UnitOfWork0=Depends(get_unit_of_work_async),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = await uow.regions.get_one_async(region_id)
    if region is None:
        raise HTTPException(status_code=404)

    dto = region_mapper.from_model_to_dto(region)
    return dto

@router.post("/",response_model=RegionNested)
async def create_one(
        create_dto:RegionCreateDTO=Body(...),
        uow:UnitOfWork0=Depends(get_unit_of_work_async),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = region_mapper.from_create_to_model(create_dto)
    await uow.regions.create_one_async(region)
    await uow.commit_async()
    dto = region_mapper.from_model_to_nested(region)
    return dto

@router.put("/",response_model=RegionNested)
async def update_one(
        region_update_dto:RegionUpdateDTO=Body(...),
        uow:UnitOfWork0=Depends(get_unit_of_work_async),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):
    
    region = await uow.regions.get_one_async(region_update_dto.region_id)
    if region is None:
        raise HTTPException(status_code=404)

    region = region_mapper.from_update_to_model(region_update_dto,region)
    await uow.regions.update_one_async(region)
    await uow.commit_async()
    region_dto = region_mapper.from_model_to_nested(region)
    return region_dto

@router.delete("/{region_id}",status_code=204)
async def delete_one(region_id : int ,uow:UnitOfWork0=Depends(get_unit_of_work_async)):
    model = uow.regions.get_one_async(region_id)
    if model is None:
        raise HTTPException(status_code=404)
    await uow.regions.delete_one_async(region_id)
    await uow.commit_async()
