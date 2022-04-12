from fastapi import APIRouter, Depends, Query, HTTPException, status

from ..services.unit_of_work import UnitOfWork
from ..DTOs.locations import LocationCreate, LocationDTO, LocationUpdate
from ..mappers.location_mapper import LocationMapper
from ..dependencies import get_location_mapper, get_unit_of_work
router = APIRouter(
    prefix="/locations",
    tags=["locations"],
    responses={
        404: {"description": "Location cannot be found"}
    }
)


@router.get("/", response_model=list[LocationDTO])
def get_all(country_id: int = Query(0), skip: int = Query(0), limit: int = Query(100),
            uow: UnitOfWork = Depends(get_unit_of_work),
            location_mapper: LocationMapper = Depends(get_location_mapper)):
    locations = uow.locations.get_all(
        country_id=country_id, skip=skip, limit=limit)
    dtos = [location_mapper.from_model_to_dto(l) for l in locations]
    return dtos


@router.get("/location_id")
def get_one(location_id: int,
            uow: UnitOfWork = Depends(get_unit_of_work),
            location_mapper: LocationMapper = Depends(get_location_mapper)
            ):
    location = uow.locations.get_one(location_id)
    if location is None:
        raise HTTPException(status_code=404)
    dto = location_mapper.from_model_to_dto(location)
    return dto


@router.post("/", response_model=LocationDTO, status_code=201)
def create_one(location_create: LocationCreate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               location_mapper: LocationMapper =Depends(get_location_mapper)
               ):
    location = location_mapper.from_create_to_model(location_create)
    uow.locations.create_one(location)
    uow.commit_refresh([location])
    dto = location_mapper.from_model_to_dto(location)
    return dto


@router.put("/", response_model=LocationDTO)
def update_one(location_update: LocationUpdate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               location_mapper: LocationMapper = Depends(get_location_mapper)
               ):
    location = uow.locations.get_one(location_update.location_id)
    if location is None:
        raise HTTPException(status_code=404)
    location = location_mapper.from_update_to_model(location_update, location)
    uow.locations.update_one(location)
    uow.commit_refresh([location])

    dto = location_mapper.from_model_to_dto(location)
    return dto


@router.delete("/{location_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_one(location_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work),
               ):
    uow.locations.delete_one(location_id)
    uow.commit_refresh()
