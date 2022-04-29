from fastapi import Depends, Query
from sqlalchemy.orm import Session

from .mappers.job_mapper import JobMapper
from .mappers.department_mapper import DepartmentMapper
from .mappers.location_mapper import LocationMapper
from .mappers.country_mapper import CountryMapper
from .mappers.region_mapper import RegionMapper
from .mappers.employee_mapper import EmployeeMapper
from .mappers.job_history_mapper import JobHistoryMapper
from .mappers.nested_mapper import NestedMapper

from .services import (
    CountriesServices,
    UnitOfWork,
    RegionsService,
    LocationsService,
    DepartmentsService,
    JobsService,
    JobHistoriesService,
    EmployeesService)

from .database import SessionFactory


def get_db() -> Session:
    db: Session = SessionFactory()
    try:
        yield db
    finally:
        db.close()


def get_base_query(limit: int = 100, skip: int = 0):
    return {"limit": limit, "skip": skip}

def get_employee_query(
        base_Query=Depends(get_base_query),
        department_id:int|None=Query(0,alias="departmentId"),
        job_id:int|None=Query(0,alias="jobId"),
        manager_id:int|None=Query(0,alias="managerId")):
    return {**base_Query,
        "department_id":department_id,
        "job_id":job_id,
        "manager_id":manager_id}

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


def get_job_service(db: Session = Depends(get_db)) -> JobsService:
    service = JobsService(db=db)
    return service


def get_employee_service(db: Session = Depends(get_db)) -> EmployeesService:
    service = EmployeesService(db=db)
    return service


def get_job_history_service(db: Session = Depends(get_db)) -> JobHistoriesService:
    service = JobHistoriesService(db=db)
    return service


def get_unit_of_work(
    db: Session = Depends(get_db),
    region_service: RegionsService = Depends(get_region_service),
    countries_service: CountriesServices = Depends(get_country_service),
    location_service: LocationsService = Depends(get_location_service),
    departments_service: DepartmentsService = Depends(get_department_service),
    jobs_service: JobsService = Depends(get_job_service),
    job_history_service: JobHistoriesService = Depends(
        get_job_history_service),
    employees_service: EmployeesService = Depends(get_employee_service)
) -> UnitOfWork:

    unit_of_work = UnitOfWork(db=db, regions_service=region_service,
                              countries_service=countries_service,
                              locations_service=location_service,
                              departments_service=departments_service,
                              jobs_service=jobs_service,
                              employees_service=employees_service,
                              job_histories_service=job_history_service)
    return unit_of_work


def get_nested_mapper() -> NestedMapper:
    return NestedMapper()


def get_region_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> RegionMapper:
    return RegionMapper(nested=nested)


def get_country_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> CountryMapper:
    return CountryMapper(nested=nested)


def get_location_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> LocationMapper:
    return LocationMapper(nested=nested)


def get_department_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> DepartmentMapper:
    return DepartmentMapper(nested=nested)


def get_job_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> JobMapper:
    return JobMapper(nested=nested)


def get_employee_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> EmployeeMapper:
    return EmployeeMapper(nested=nested)


def get_job_history_mapper(nested: NestedMapper = Depends(get_nested_mapper)) -> JobHistoryMapper:
    return JobHistoryMapper(nested=nested)
