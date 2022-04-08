from .regions import RegionsService
from sqlalchemy.orm import Session
from ..database import Base

class UnitOfWork:
    def __init__(self,db:Session,regions_service:RegionsService) -> None:
        self._db = db
        self.regions = regions_service
        assert self._db == self.regions._db
    
    def commit_refresh(self,items:list[Base]|None=None):
        self._db.commit()
        if items:
            for item in items:
                if item is not None:
                    self._db.refresh(item)

        


        