from sqlalchemy.orm import Session
from ..models import Country


class CountriesServices:
    def __init__(self, db: Session) -> None:
        self._db: Session = db

    def create_one(self, country: Country):
        self._db.add(country)

    def get_one(self, country_id: int) -> Country:
        return self._db.query(Country).filter(Country.country_id == country_id).first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Country]:
        return self._db.query(Country).offset(skip).limit(limit).all()

    def get_all_by_region(self, region_id, skip: int = 0, limit: int = 100):
        return self._db.query(Country)\
            .filter(Country.region_id == region_id)\
            .offset(skip)\
            .limit(limit)\
            .all()

    def update_one(self, country: Country):
        self._db.query(Country)\
            .filter(Country.country_id == country.country_id)\
            .update({column: getattr(country, column) for column in Country.__table__.columns.keys()})

    def delete_one(self, country_id: int):
        self._db.query(Country).filter(
            Country.country_id == country_id).delete()
