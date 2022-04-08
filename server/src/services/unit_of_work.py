from sqlalchemy.orm import Session
from ..database import Base

from .regions import RegionsService
from .countries import CountriesServices

class UnitOfWork:
    def __init__(self,
        db:Session,
        regions_service:RegionsService,
        countries_service:CountriesServices) -> None:


        self._db = db
        self.regions = regions_service
        self.countries = countries_service
        assert self._db == self.regions._db == self.countries._db
    
    def commit_refresh(self,items:list[Base]|None=None):
        self._db.commit()
        if items:
            for item in items:
                if item is not None:
                    self._db.refresh(item)

        


        