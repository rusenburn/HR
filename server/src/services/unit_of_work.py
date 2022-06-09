from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from ..database import Base

from .regions import RegionsService, RegionsService0
from .countries import CountriesAsyncService, CountriesServices
from .locations import LocationAsyncService, LocationsService
from .departments import DepartmentsService
from .jobs import JobsService
from .employees import EmployeesService
from .job_histories import JobHistoriesService
from .users import UsersService

class UnitOfWork:
    def __init__(self,
        db:Session,
        regions_service:RegionsService,
        countries_service:CountriesServices,
        locations_service:LocationsService,
        departments_service:DepartmentsService,
        jobs_service:JobsService,
        employees_service:EmployeesService,
        job_histories_service : JobHistoriesService,
        users_service:UsersService
        ) -> None:

        self._db = db
        self.regions = regions_service
        self.countries = countries_service
        self.locations = locations_service
        self.departments = departments_service
        self.jobs = jobs_service
        self.employees = employees_service
        self.job_histories = job_histories_service
        self.users = users_service
        assert self._db == self.regions._db == self.countries._db == self.locations._db == self.departments._db
    
    def commit_refresh(self,items:list[Base]|None=None):
        self._db.commit()
        if items:
            for item in items:
                if item is not None:
                    self._db.refresh(item)

class UnitOfWork0:
    def __init__(self,db:AsyncSession,region_service:RegionsService0,country_service:CountriesAsyncService,location_service:LocationAsyncService) -> None:
        self._db = db
        self.regions = region_service
        self.countries = country_service
        self.locations = location_service
        assert self._db == self.regions._db == self.countries._db == self.locations._db
    
    async def commit_async(self,instance=None):
        await self._db.commit()
        if instance:
            await self._db.refresh(instance)