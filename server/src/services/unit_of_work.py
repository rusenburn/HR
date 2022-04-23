from sqlalchemy.orm import Session

from ..database import Base

from .regions import RegionsService
from .countries import CountriesServices
from .locations import LocationsService
from .departments import DepartmentsService
from .jobs import JobsService
from .employees import EmployeesService
from .job_histories import JobHistoriesService
class UnitOfWork:
    def __init__(self,
        db:Session,
        regions_service:RegionsService,
        countries_service:CountriesServices,
        locations_service:LocationsService,
        departments_service:DepartmentsService,
        jobs_service:JobsService,
        employees_service:EmployeesService,
        job_histories_service : JobHistoriesService
        ) -> None:

        self._db = db
        self.regions = regions_service
        self.countries = countries_service
        self.locations = locations_service
        self.departments = departments_service
        self.jobs = jobs_service
        self.employees = employees_service
        self.job_histories = job_histories_service
        assert self._db == self.regions._db == self.countries._db == self.locations._db == self.departments._db
    
    def commit_refresh(self,items:list[Base]|None=None):
        self._db.commit()
        if items:
            for item in items:
                if item is not None:
                    self._db.refresh(item)