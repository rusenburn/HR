from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from database import Base

from .regions import RegionsService, RegionsService0
from .countries import CountriesAsyncService, CountriesServices
from .locations import LocationAsyncService, LocationsService
from .departments import DeparmentAsyncService, DepartmentsService
from .jobs import JobAsyncService, JobsService
from .employees import EmployeeAsyncService, EmployeesService
from .job_histories import JobHistoriesService, JobHistoryAsyncService
from .users import UsersAsyncService, UsersService

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
    def __init__(self,
                    db:AsyncSession,
                    region_service:RegionsService0,
                    country_service:CountriesAsyncService,
                    location_service:LocationAsyncService,
                    department_service:DeparmentAsyncService,
                    job_service:JobAsyncService,
                    employee_service:EmployeeAsyncService,
                    job_history_service:JobHistoryAsyncService,
                    user_service:UsersAsyncService) -> None:
        self._db = db
        self.regions = region_service
        self.countries = country_service
        self.locations = location_service
        self.departments = department_service
        self.jobs = job_service
        self.employees = employee_service
        self.job_history = job_history_service
        self.users = user_service
        assert self._db == self.regions._db == self.countries._db == self.locations._db
    
    async def commit_async(self,instance=None):
        await self._db.commit()
        if instance:
            await self._db.refresh(instance)