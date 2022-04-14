from sqlalchemy.orm import Session, joinedload
from ..models import Country


class CountriesServices:
    def __init__(self, db: Session) -> None:
        self._db: Session = db

    def create_one(self, country: Country):
        self._db.add(country)

    def get_one(self, country_id: int) -> Country:
        return self._db.query(Country)\
            .options(joinedload(Country.region),joinedload(Country.locations))\
            .filter(Country.country_id == country_id).first()

    def get_all(self, region_id: int = 0, skip: int = 0, limit: int = 100) -> list[Country]:
        q = self._db.query(Country)
        if region_id > 0:
            q = q.filter(Country.region_id == region_id)
        return q.offset(skip).limit(limit).all()

    def update_one(self, country: Country):
        self._db.query(Country)\
            .filter(Country.country_id == country.country_id)\
            .update({column: getattr(country, column) for column in Country.__table__.columns.keys()})

    def delete_one(self, country_id: int):
        self._db.query(Country).filter(
            Country.country_id == country_id).delete()
