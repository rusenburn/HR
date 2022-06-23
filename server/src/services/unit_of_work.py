from sqlalchemy.ext.asyncio import AsyncSession
from .regions import RegionsAsyncService
from .countries import CountriesAsyncService
from .locations import LocationAsyncService
from .departments import DeparmentAsyncService
from .jobs import JobAsyncService
from .employees import EmployeeAsyncService
from .job_histories import  JobHistoryAsyncService
from .users import UsersAsyncService

class UnitOfWork:
    def __init__(self,
                    db:AsyncSession,
                    region_service:RegionsAsyncService,
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
        assert self._db == self.regions._db == self.countries._db == self.locations._db == self.job_history._db
    
    async def commit_async(self,instance=None):
        await self._db.commit()
        if instance:
            await self._db.refresh(instance)