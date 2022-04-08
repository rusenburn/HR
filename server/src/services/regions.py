from sqlalchemy.orm import Session
from ..models import Region


class RegionsService:
    def __init__(self,db:Session) -> None:
        self._db:Session = db
    
    def create_one(self,region:Region):
        self._db.add(region)
    
    def get_one(self,region_id:int)->Region:
        return self._db.query(Region).filter(Region.region_id == region_id).first()

    def get_all(self,skip:int=0,limit:int=100)->list[Region]:
        return self._db.query(Region).offset(skip).limit(limit).all()
    
    def update_one(self,region:Region):
        self._db.query(Region)\
            .filter(Region.region_id == region.region_id)\
            .update({column: getattr(region, column) for column in Region.__table__.columns.keys()})
    
    def delete_one(self,region_id:int):
        self._db.query(Region).filter(Region.region_id == region_id).delete()




