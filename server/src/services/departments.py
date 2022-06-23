from argparse import ArgumentError
from sqlalchemy.orm import joinedload,Query,selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import update,delete
from models import Department

class DeparmentAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db
    

    async def get_all_async(self, location_id: int = 0, skip: int = 0, limit: int = 100) -> list[Department]:
        q :Query = select(Department)
        if location_id > 0:
            q = q.where(Department.location_id == location_id)
        q = q.offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def get_one_async(self, department_id: int) -> Department:
        q:Query = select(Department)
        q = q.options(
            selectinload(Department.location),
            selectinload(Department.employees),
            selectinload(Department.job_histories))\
            .filter(Department.department_id == department_id).limit(1)
        
        results = await self._db.execute(q)
        return results.scalars().first()

    async def create_one_async(self, department: Department):
        if not isinstance(department, Department):
            raise ArgumentError(
                department, f"argument type is invalid {department}")
            
        self._db.add(department)

    async def update_one_async(self, department: Department):
        if not isinstance(department, Department):
            raise ArgumentError(department, "Must be a Department type")
        attrs = {column: getattr(department, column) for column in Department.__table__.columns.keys()}
        q = update(Department)\
            .where(Department.department_id == department.department_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")
        await  self._db.execute(q)

    async def delete_one_async(self, department_id):
        q = delete(Department).where(Department.department_id == department_id)
        await self._db.execute(q)