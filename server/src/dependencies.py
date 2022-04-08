from fastapi import Depends
from sqlalchemy.orm import Session

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

def get_unit_of_work(
    db:Session=Depends(get_db),
    region_service:Session=Depends(get_region_service))->UnitOfWork:
    unit_of_work = UnitOfWork(db=db,regions_service=region_service)
    return unit_of_work

def get_region_mapper()->RegionMapper:
    return RegionMapper()
