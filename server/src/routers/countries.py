from copy import deepcopy
from fastapi import APIRouter, Depends, HTTPException

from ..DTOs.nested import CountryNested
from ..DTOs.countries import CountryDTO, CountryCreateDTO, CountryUpdateDTO
from ..mappers.country_mapper import CountryMapper
from ..services.unit_of_work import UnitOfWork, UnitOfWork0
from ..dependencies import get_unit_of_work, get_country_mapper, get_base_query, get_unit_of_work_async, require_admin_user

router = APIRouter(
    prefix="/countries",
    tags=["countries"],
    responses={404: {"description": "Not Found"}},
    dependencies=[Depends(require_admin_user)]
)


@router.get("/{country_id}", response_model=CountryDTO)
async def get_one(country_id: int, uow: UnitOfWork0 = Depends(get_unit_of_work_async),
                  country_mapper: CountryMapper = Depends(get_country_mapper)
                  ):
    country = await uow.countries.get_one_async(country_id)
    if country is None:
        raise HTTPException(status_code=404)
    dto = country_mapper.from_model_to_dto(country)
    return dto


@router.get("/", response_model=list[CountryNested])
async def get_all(uow: UnitOfWork0 = Depends(get_unit_of_work_async),
                  country_mapper: CountryMapper = Depends(get_country_mapper),
                  query=Depends(get_base_query)):
    countries = await uow.countries.get_all_async(**query)
    dtos = [country_mapper.from_model_to_nested(c) for c in countries]
    return dtos


@router.post("/", response_model=CountryNested)
async def create_one(create_dto: CountryCreateDTO,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               country_mapper: CountryMapper = Depends(get_country_mapper)
               ):
    region = await uow.regions.get_one_async(create_dto.region_id)
    if region is None:
        raise HTTPException(
            status_code=400,
            detail={
                "description": f"region_id [{create_dto.region_id}] must be a valid region"})
    country = country_mapper.from_create_to_model(create_dto)
    await uow.countries.create_one_async(country)
    await uow.commit_async()
    dto = country_mapper.from_model_to_nested(country)
    return dto


@router.put("/")
async def update_one(update_dto: CountryNested,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               country_mapper: CountryMapper = Depends(get_country_mapper)):
    model = await uow.countries.get_one_async(update_dto.country_id)
    if model is None:
        raise HTTPException(status_code=404)
    region = await uow.regions.get_one_async(update_dto.region_id)
    if region is None:
        raise HTTPException(
            status_code=400,
            detail={
                "description": f"region_id [{update_dto.region_id}] must be a valid region"})

    model = country_mapper.from_update_to_model(update_dto, model)
    res = await uow.countries.update_one_async(model)
    await uow.commit_async(model)
    print(model.country_name)
    dto = country_mapper.from_model_to_nested(model)
    return dto


@router.delete("/{country_id}", status_code=204)
async def delete_one(country_id: int,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               ):

    model = await uow.countries.get_one_async(country_id)
    if model is None:
        raise HTTPException(status_code=404)
    await uow.countries.delete_one_async(country_id)
    await uow.commit_async()
