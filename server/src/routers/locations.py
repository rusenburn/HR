from fastapi import APIRouter, Depends, Query, HTTPException, status

from DTOs.locations import LocationCreate, LocationDTO, LocationUpdate
from DTOs.nested import LocationNested
from services.unit_of_work import UnitOfWork, UnitOfWork0
from mappers.location_mapper import LocationMapper
from dependencies import get_location_mapper, get_unit_of_work, get_unit_of_work_async, require_admin_user

router = APIRouter(
    prefix="/locations",
    tags=["locations"],
    responses={
        404: {"description": "Location cannot be found"}
    },
    dependencies=[Depends(require_admin_user)]
)


@router.get("/", response_model=list[LocationNested])
async def get_all(country_id: int = Query(0), skip: int = Query(0), limit: int = Query(100),
            uow: UnitOfWork0 = Depends(get_unit_of_work_async),
            location_mapper: LocationMapper = Depends(get_location_mapper)):
    locations = await uow.locations.get_all_async(
        country_id=country_id, skip=skip, limit=limit)
    dtos = [location_mapper.from_model_to_nested(l) for l in locations]
    return dtos


@router.get("/{location_id}")
async def get_one(location_id: int,
            uow: UnitOfWork0 = Depends(get_unit_of_work_async),
            location_mapper: LocationMapper = Depends(get_location_mapper)
            ):
    location = await uow.locations.get_one_async(location_id)
    if location is None:
        raise HTTPException(status_code=404)
    dto = location_mapper.from_model_to_dto(location)
    return dto


@router.post("/", response_model=LocationNested, status_code=201)
async def create_one(location_create: LocationCreate,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               location_mapper: LocationMapper =Depends(get_location_mapper)
               ):
    location = location_mapper.from_create_to_model(location_create)
    await uow.locations.create_one_async(location)
    await uow.commit_async()
    dto = location_mapper.from_model_to_nested(location)
    return dto


@router.put("/", response_model=LocationNested)
async def update_one(location_update: LocationUpdate,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               location_mapper: LocationMapper = Depends(get_location_mapper)
               ):
    location = await uow.locations.get_one_async(location_update.location_id)
    if location is None:
        raise HTTPException(status_code=404)
    country = await uow.countries.get_one_async(location_update.country_id)
    if country is None:
        raise HTTPException(status_code=400)
    location = location_mapper.from_update_to_model(location_update, location)
    await uow.locations.update_one_async(location)
    await uow.commit_async()

    dto = location_mapper.from_model_to_nested(location)
    return dto


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_one(location_id: int,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               ):
    await  uow.locations.delete_one_async(location_id)
    await uow.commit_async()
