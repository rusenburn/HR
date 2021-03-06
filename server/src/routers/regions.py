from fastapi import APIRouter, Body ,Depends,HTTPException

from services.redis_cache import RedisCacheService


from mappers.region_mapper import RegionMapper
from mappers.nested_mapper import NestedMapper
from DTOs.nested import RegionNested
from DTOs.regions import RegionDTO
from DTOs.regions.region_create_dto import RegionCreateDTO
from DTOs.regions.region_update_dto import RegionUpdateDTO
from services.unit_of_work import UnitOfWork
from dependencies import get_unit_of_work_async, get_base_query, get_region_mapper, require_admin_user,get_cache_service

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
    uow:UnitOfWork=Depends(get_unit_of_work_async),
    cache:RedisCacheService=Depends(get_cache_service),
    region_mapper:RegionMapper=Depends(get_region_mapper),
    query=Depends(get_base_query)
    ):
    regions = await cache.get_regions()
    if regions is None:
        regions = await uow.regions.get_all_async(**query)
        await cache.set_regions(regions)
    region_dtos = [region_mapper.from_model_to_nested(r) for r in regions]
    return region_dtos


@router.get("/{region_id}",response_model=RegionDTO)
async def get_one(
        region_id:int,
        uow:UnitOfWork=Depends(get_unit_of_work_async),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = await uow.regions.get_one_async(region_id)
    if region is None:
        raise HTTPException(status_code=404)

    dto = region_mapper.from_model_to_dto(region)
    return dto

@router.post("/",response_model=RegionNested,status_code=201)
async def create_one(
        create_dto:RegionCreateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work_async),
        region_mapper:RegionMapper=Depends(get_region_mapper)
        ):

    region = region_mapper.from_create_to_model(create_dto)
    await uow.regions.create_one_async(region)
    await uow.commit_async()
    dto = region_mapper.from_model_to_nested(region)
    return dto

@router.put("/",response_model=RegionNested,status_code=200)
async def update_one(
        region_update_dto:RegionUpdateDTO=Body(...),
        uow:UnitOfWork=Depends(get_unit_of_work_async),
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
async def delete_one(region_id : int ,uow:UnitOfWork=Depends(get_unit_of_work_async)):
    model = await uow.regions.get_one_async(region_id)
    if model is None:
        raise HTTPException(status_code=404)
    await uow.regions.delete_one_async(region_id)
    await uow.commit_async()
