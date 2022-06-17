from argparse import ArgumentError
from sqlalchemy.orm import Session, joinedload, selectinload
from models import Region
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm.query import Query
from sqlalchemy import update, delete


class RegionsService:
    def __init__(self, db: Session) -> None:
        self._db: Session = db

    def create_one(self, region: Region):
        self._db.add(region)

    def get_one(self, region_id: int) -> Region:
        return self._db.query(Region).options(joinedload(Region.countries))\
            .filter(Region.region_id == region_id)\
            .first()

    def get_all(self, skip: int = 0, limit: int = 100) -> list[Region]:
        return self._db.query(Region).offset(skip).limit(limit).all()

    def update_one(self, region: Region):
        self._db.query(Region)\
            .filter(Region.region_id == region.region_id)\
            .update({column: getattr(region, column) for column in Region.__table__.columns.keys()})

    def delete_one(self, region_id: int):
        self._db.query(Region).filter(Region.region_id == region_id).delete()


class RegionsService0:
    def __init__(self, db: AsyncSession) -> None:
        self._db: AsyncSession = db

    async def create_one_async(self, region: Region):
        if not isinstance(region,Region):
            raise ArgumentError(region,"argument must be a Region Type.")
        self._db.add(region)

    async def get_one_async(self, region_id: int) -> Region:
        query: Query = select(Region)
        query = query.options(selectinload(Region.countries))\
            .filter(Region.region_id == region_id)
        results = await self._db.execute(query)
        return results.scalars().first()

    async def get_all_async(self, skip: int = 0, limit: int = 100) -> list[Region]:
        q: Query = select(Region)
        q = q.offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def update_one_async(self, region: Region):
        if not isinstance(region,Region):
            raise ArgumentError(region,"argument must be a Region Type.")
        attrs = {column: getattr(region, column)
                 for column in Region.__table__.columns.keys()}
        q = update(Region)\
            .where(Region.region_id == region.region_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")
        await self._db.execute(q)

    async def delete_one_async(self, region_id: int):
        q = delete(Region).where(Region.region_id == region_id).execution_options(
            synchronize_session="fetch")
        await self._db.execute(q)
