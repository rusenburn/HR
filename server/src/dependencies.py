from fastapi import Depends, Query, HTTPException, status
from redis import Redis
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from redis import asyncio as aioredis
from services.redis_cache import REDIS_URL, RedisCacheService
from services.employees import EmployeeAsyncService
from services.job_histories import JobHistoryAsyncService
from services.users import UsersAsyncService
from services.jobs import JobAsyncService

from services.departments import DeparmentAsyncService
from services.locations import LocationAsyncService
from services.countries import CountriesAsyncService
from services.unit_of_work import UnitOfWork
from services.regions import RegionsAsyncService
from services.jwt import JwtContainer, JwtService
from fastapi.security import OAuth2PasswordBearer
from mappers.job_mapper import JobMapper
from mappers.department_mapper import DepartmentMapper
from mappers.location_mapper import LocationMapper
from mappers.country_mapper import CountryMapper
from mappers.region_mapper import RegionMapper
from mappers.employee_mapper import EmployeeMapper
from mappers.job_history_mapper import JobHistoryMapper
from mappers.nested_mapper import NestedMapper
from mappers.user_mapper import UserMapper
from services import (
    CryptService)

from database import SessionFactory, AsyncSessionFactory


oauth2_schema = OAuth2PasswordBearer(tokenUrl="users/login", auto_error=False)
redis = aioredis.from_url(REDIS_URL)

def get_db() -> Session:
    db: Session = SessionFactory()
    try:
        yield db
    finally:
        db.close()


def get_base_query(limit: int = 100, skip: int = 0):
    return {"limit": limit, "skip": skip}

def get_location_query(
        base_query = Depends(get_base_query),
        country_id:int | None= Query(0,alias="countryId")):
        return {
            **base_query,
            "country_id":country_id}

def get_department_query(
    base_query = Depends(get_base_query),
    location_id:int|None = Query(0,alias="locationId")):
    return {**base_query,
        "location_id" : location_id}

def get_employee_query(
        base_query=Depends(get_base_query),
        department_id: int | None = Query(0, alias="departmentId"),
        job_id: int | None = Query(0, alias="jobId"),
        manager_id: int | None = Query(0, alias="managerId")):
    return {**base_query,
            "department_id": department_id,
            "job_id": job_id,
            "manager_id": manager_id}



def get_job_history_query(
    base_query = Depends(get_base_query),
    employee_id : int |None= Query(0),
    department_id :int |None= Query(0),
    job_id :int |None= Query(0)):

    return{
        **base_query,
        "employee_id":employee_id,
        "department_id":department_id,
        "job_id":job_id}

# def get_region_service(db: Session = Depends(get_db)) -> RegionsService:
#     service = RegionsService(db=db)
#     return service


# def get_country_service(db: Session = Depends(get_db)) -> CountriesServices:
#     service = CountriesServices(db=db)
#     return service


# def get_location_service(db: Session = Depends(get_db)) -> LocationsService:
#     service = LocationsService(db=db)
#     return service


# def get_department_service(db: Session = Depends(get_db)) -> DepartmentsService:
#     service = DepartmentsService(db=db)
#     return service


# def get_job_service(db: Session = Depends(get_db)) -> JobsService:
#     service = JobsService(db=db)
#     return service


# def get_employee_service(db: Session = Depends(get_db)) -> EmployeesService:
#     service = EmployeesService(db=db)
#     return service


# def get_job_history_service(db: Session = Depends(get_db)) -> JobHistoriesService:
#     service = JobHistoriesService(db=db)
#     return service


# def get_users_service(db: Session = Depends(get_db)) -> UsersService:
#     service = UsersService(db=db)
#     return service


# def get_unit_of_work(
#     db: Session = Depends(get_db),
#     region_service: RegionsService = Depends(get_region_service),
#     countries_service: CountriesServices = Depends(get_country_service),
#     location_service: LocationsService = Depends(get_location_service),
#     departments_service: DepartmentsService = Depends(get_department_service),
#     jobs_service: JobsService = Depends(get_job_service),
#     job_history_service: JobHistoriesService = Depends(
#         get_job_history_service),
#     employees_service: EmployeesService = Depends(get_employee_service),
#     users_service: UsersService = Depends(get_users_service)
# ) -> UnitOfWork:
# 
    # unit_of_work = UnitOfWork(db=db, regions_service=region_service,
    #                           countries_service=countries_service,
    #                           locations_service=location_service,
    #                           departments_service=departments_service,
    #                           jobs_service=jobs_service,
    #                           employees_service=employees_service,
    #                           job_histories_service=job_history_service,
    #                           users_service=users_service)
    # return unit_of_work


def get_crypt_service() -> CryptService:
    return CryptService()


def get_jwt_service() -> JwtService:
    return JwtService()


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


def get_users_mapper(crypt_service: CryptService = Depends(get_crypt_service)) -> UserMapper:
    return UserMapper(crypt_service=crypt_service)


def get_jwt_container(token: str = Depends(oauth2_schema), jwt_service: JwtService = Depends(get_jwt_service)) -> JwtContainer:
    return jwt_service.build_jwt_container(token)


def get_current_user(jwt_container: JwtContainer = Depends(get_jwt_container)) -> str:
    return jwt_container.username


def require_logged_in_user(jwt_container: JwtContainer = Depends(get_jwt_container)) -> JwtContainer:
    if (jwt_container.username == "" or jwt_container.username == None):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="UnAuthorized User, Must be logged in",
            headers={"WWW-Authenticate": "Bearer"},)
    return jwt_container


def require_admin_user(jwt_container: JwtContainer = Depends(get_jwt_container)):
    if(jwt_container.username == "" or jwt_container.username == None
            or not jwt_container.admin):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated,User must be an admin",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return jwt_container


# Async Depedencies
async def get_db_async() -> AsyncSession:
    async with AsyncSessionFactory() as session:
        try:
            yield session
        finally:
            await session.close()
        # async with session.begin():
        #     yield session


async def get_regions_service_async(db: AsyncSession = Depends(get_db_async)) -> RegionsAsyncService:
    service = RegionsAsyncService(db=db)
    return service


async def get_country_service_async(db: AsyncSession = Depends(get_db_async)) -> CountriesAsyncService:
    service = CountriesAsyncService(db=db)
    return service

async def get_location_service_async(db:AsyncSession=Depends(get_db_async))->LocationAsyncService:
    service = LocationAsyncService(db=db)
    return service

async def get_department_service_async(db:AsyncSession=Depends(get_db_async))->DeparmentAsyncService:
    service = DeparmentAsyncService(db=db)
    return service
async def get_jobs_service_async(db:AsyncSession=Depends(get_db_async))->JobAsyncService:
    service = JobAsyncService(db=db)
    return service
async def get_employee_service_async(db:AsyncSession=Depends(get_db_async))->EmployeeAsyncService:
    service=EmployeeAsyncService(db=db)
    return service
async def get_job_history_service_async(db:AsyncSession=Depends(get_db_async))->JobHistoryAsyncService:
    service = JobHistoryAsyncService(db=db)
    return service

async def get_users_service_async(db:AsyncSession=Depends(get_db_async))->UsersAsyncService:
    service =UsersAsyncService(db=db)
    return service

async def get_unit_of_work_async(
        db: AsyncSession = Depends(get_db_async),
        regions: RegionsAsyncService = Depends(get_regions_service_async),
        countries: CountriesAsyncService = Depends(get_country_service_async),
        locations:LocationAsyncService=Depends(get_location_service_async),
        departments:DeparmentAsyncService=Depends(get_department_service_async),
        jobs:JobAsyncService=Depends(get_jobs_service_async),
        employees:EmployeeAsyncService=Depends(get_employee_service_async),
        job_history:JobHistoryAsyncService=Depends(get_job_history_service_async),
        users:UsersAsyncService=Depends(get_users_service_async)) -> UnitOfWork:

    service = UnitOfWork(
        db=db, 
        region_service=regions,
        country_service=countries,
        location_service=locations,
        department_service=departments,
        job_service = jobs,
        employee_service=employees,
        job_history_service=job_history,
        user_service=users)
    return service

# redis
async def get_cache_service()->RedisCacheService:
    service = RedisCacheService(redis=redis)
    return service
