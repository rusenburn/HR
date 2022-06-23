from argparse import ArgumentError
from sqlalchemy.orm import joinedload, selectinload
from sqlalchemy.orm.query import Query
from sqlalchemy.future import select
from sqlalchemy import update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from models import Country

class CountriesAsyncService:
    def __init__(self, db: AsyncSession) -> None:
        self._db = db

    async def create_one_async(self, country: Country):
        if not isinstance(country,Country):
            raise ArgumentError(country,"argument must be a Country Type.")
        self._db.add(country)

    async def get_one_async(self, country_id: int) -> Country:
        q: Query = select(Country)
        # TODO check if limit = 1 has a better perfomance
        q = q.options(joinedload(Country.region), joinedload(Country.locations))\
            .filter(Country.country_id == country_id)
        results = await self._db.execute(q)
        return results.scalars().first()

    async def get_all_async(self, region_id: int = 0, skip: int = 0, limit: int = 100) -> list[Country]:
        q: Query = select(Country)
        if region_id > 0:
            q = q.filter(Country.region_id == region_id)
        q = q.offset(skip).limit(limit)

        results = await self._db.execute(q)
        return results.scalars().all()

    async def update_one_async(self, country: Country):
        if not isinstance(country,Country):
            raise ArgumentError(country,"argument must be a Country Type.")

        attrs = {column: getattr(country, column)
                 for column in Country.__table__.columns.keys()}
        q = update(Country)\
            .where(Country.country_id == country.country_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")
        res = await self._db.execute(q)
        return res

    async def delete_one_async(self, country_id: int):
        q = delete(Country)\
            .where(Country.country_id == country_id)\
            .execution_options(synchronize_session="fetch")
        await self._db.execute(q)
