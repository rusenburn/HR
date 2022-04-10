from fastapi import Depends
from sqlalchemy.orm import Session

from .mappers.job_mapper import JobMapper

from .mappers.department_mapper import DepartmentMapper
from .mappers.location_mapper import LocationMapper
from .mappers.country_mapper import CountryMapper
from .mappers.region_mapper import RegionMapper

from .services import (
    CountriesServices,
    UnitOfWork,
    RegionsService,
    LocationsService,
    DepartmentsService,
    JobsService
)

from .database import SessionFactory


def get_db() -> Session:
    db: Session = SessionFactory()
    try:
        yield db
    finally:
        db.close()


def get_region_service(db: Session = Depends(get_db)) -> RegionsService:
    service = RegionsService(db=db)
    return service


def get_country_service(db: Session = Depends(get_db)) -> CountriesServices:
    service = CountriesServices(db=db)
    return service


def get_location_service(db: Session = Depends(get_db)) -> LocationsService:
    service = LocationsService(db=db)
    return service


def get_department_service(db: Session = Depends(get_db)) -> DepartmentsService:
    service = DepartmentsService(db=db)
    return service

def get_job_service(db:Session=Depends(get_db))->JobsService:
    service = JobsService(db=db)
    return service

def get_unit_of_work(
    db: Session = Depends(get_db),
    region_service: RegionsService = Depends(get_region_service),
    countries_service: CountriesServices = Depends(get_country_service),
    location_service: LocationsService = Depends(get_location_service),
    departments_service: DepartmentsService = Depends(get_department_service),
    jobs_service:JobsService = Depends(get_job_service)
) -> UnitOfWork:

    unit_of_work = UnitOfWork(db=db, regions_service=region_service,
                              countries_service=countries_service,
                              locations_service=location_service,
                              departments_service=departments_service,
                              jobs_service=jobs_service
                              )
    return unit_of_work


def get_region_mapper() -> RegionMapper:
    return RegionMapper()


def get_country_mapper() -> CountryMapper:
    return CountryMapper()


def get_location_mapper() -> LocationMapper:
    return LocationMapper()


def get_department_mapper() -> DepartmentMapper:
    return DepartmentMapper()

def get_job_mapper()->JobMapper:
    return JobMapper()
