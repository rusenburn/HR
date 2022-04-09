from argparse import ArgumentError
from sqlalchemy.orm import Session

from ..models import Location


class LocationsService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, location_id: int):
        return self._db.query(Location).filter(Location.location_id == location_id).first()

    def create_one(self, location: Location):
        if not isinstance(location, Location):
            raise ArgumentError(location, "argument must be a Location type.")
        self._db.add(location)

    def get_all(self, country_id: int = 0, skip: int = 0, limit: int = 100) -> list[Location]:
        q = self._db.query(Location)
        if country_id > 0:
            q = q.filter(Location.country_id == country_id)
        return q.offset(skip).limit(limit).all()

    def update_one(self, location: Location):

        if not isinstance(location, Location):
            raise ArgumentError(location, "argument must be a Location type.")

        self._db.query(Location)\
            .filter(Location.location_id == location.location_id)\
            .update({column: getattr(location, column) for column in Location.__table__.columns.keys()})

    def delete_one(self, location_id: int):
        self._db.query(Location)\
            .filter(Location.location_id == location_id)\
            .delete()
