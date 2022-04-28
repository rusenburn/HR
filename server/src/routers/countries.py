from fastapi import APIRouter, Depends, HTTPException


from ..DTOs.nested import CountryNested
from ..DTOs.countries import CountryDTO, CountryCreateDTO, CountryUpdateDTO
from ..mappers.country_mapper import CountryMapper
from ..services.unit_of_work import UnitOfWork
from ..dependencies import get_unit_of_work, get_country_mapper,get_base_query

router = APIRouter(
    prefix="/countries",
    tags=["countries"],
    responses={404: {"description": "Not Found"}}
)


@router.get("/{country_id}", response_model=CountryDTO)
def get_one(country_id: int, uow: UnitOfWork = Depends(get_unit_of_work),
            country_mapper: CountryMapper = Depends(get_country_mapper)
            ):
    country = uow.countries.get_one(country_id)
    if country is None:
        raise HTTPException(status_code=404)
    dto = country_mapper.from_model_to_dto(country)
    return dto


@router.get("/", response_model=list[CountryNested])
def get_all(uow: UnitOfWork = Depends(get_unit_of_work),
            country_mapper: CountryMapper = Depends(get_country_mapper),
            query=Depends(get_base_query)):
    countries = uow.countries.get_all(**query)
    dtos = [country_mapper.from_model_to_nested(c) for c in countries]
    return dtos


@router.post("/", response_model=CountryNested)
def create_one(create_dto: CountryCreateDTO,
               uow: UnitOfWork = Depends(get_unit_of_work),
               country_mapper: CountryMapper = Depends(get_country_mapper)
               ):
    region = uow.regions.get_one(create_dto.region_id)
    if region is None:
        raise HTTPException(
            status_code=400,
            detail={
                "description": f"region_id [{create_dto.region_id}] must be a valid region"})
    country = country_mapper.from_create_to_model(create_dto)
    uow.countries.create_one(country)
    uow.commit_refresh([country])
    dto = country_mapper.from_model_to_nested(country)
    return dto


@router.put("/")
def update_one(update_dto: CountryNested,
               uow: UnitOfWork = Depends(get_unit_of_work),
               country_mapper: CountryMapper = Depends(get_country_mapper)):
    model = uow.countries.get_one(update_dto.country_id)
    if model is None:
        raise HTTPException(status_code=404)
        
    region = uow.regions.get_one(update_dto.region_id)
    if region is None:
        raise HTTPException(
            status_code=400,
            detail={
                "description": f"region_id [{update_dto.region_id}] must be a valid region"})

    model = country_mapper.from_update_to_model(update_dto, model)
    uow.countries.update_one(model)
    uow.commit_refresh([model])
    dto = country_mapper.from_model_to_nested(model)
    return dto


@router.delete("/{country_id}", status_code=204)
def delete_one(country_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work),
               ):

    model = uow.countries.get_one(country_id)
    if model is None:
        raise HTTPException(status_code=404)
    uow.countries.delete_one(country_id)
    uow.commit_refresh()
