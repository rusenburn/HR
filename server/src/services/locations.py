from argparse import ArgumentError
from sqlalchemy.orm import joinedload,selectinload,Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import select , update, delete

from models import Location

class LocationAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db
    
    async def get_one_async(self, location_id: int):
        q :Query = select(Location)\
            .options(selectinload(Location.country),selectinload(Location.departments))\
            .filter(Location.location_id == location_id)
        
        results = await self._db.execute(q)
        return results.scalars().first()

    async def create_one_async(self, location: Location):
        if not isinstance(location, Location):
            raise ArgumentError(location, "argument must be a Location type.")
        self._db.add(location)

    async def get_all_async(self, country_id: int = 0, skip: int = 0, limit: int = 100) -> list[Location]:
        q :Query= select(Location)
        if country_id>0:
            q = q.filter(Location.country_id == country_id)
        q = q.offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def update_one_async(self, location: Location):
        if not isinstance(location, Location):
            raise ArgumentError(location, "argument must be a Location type.")

        attrs = {column: getattr(location, column) for column in Location.__table__.columns.keys()}
        q = update(Location)\
            .where(Location.location_id == location.location_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")

        await self._db.execute(q)

    async def delete_one_async(self, location_id: int):
        q = delete(Location)\
            .where(Location.location_id == location_id)\
            .execution_options(synchronize_session="fetch")
        await self._db.execute(q)