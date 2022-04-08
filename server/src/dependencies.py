from fastapi import Depends
from sqlalchemy.orm import Session

from .mappers.country_mapper import CountryMapper
from .services.countries import CountriesServices

from .mappers.region_mapper import RegionMapper

from .services.unit_of_work import UnitOfWork

from .services.regions import RegionsService
from .database import SessionFactory

def get_db()->Session:
    db: Session = SessionFactory()
    try:
        yield db
    finally:
        db.close()
    
def get_region_service(db:Session=Depends(get_db))->RegionsService:
    service = RegionsService(db=db)
    return service


def get_country_service(db:Session=Depends(get_db))->CountriesServices:
    service = CountriesServices(db=db)
    return service

def get_unit_of_work(
    db:Session=Depends(get_db),
    region_service:RegionsService=Depends(get_region_service),
    countries_service:CountriesServices=Depends(get_country_service)
    )->UnitOfWork:

    unit_of_work = UnitOfWork(db=db,regions_service=region_service,countries_service=countries_service)
    return unit_of_work

def get_region_mapper()->RegionMapper:
    return RegionMapper()

def get_country_mapper()->CountryMapper:
    return CountryMapper()

