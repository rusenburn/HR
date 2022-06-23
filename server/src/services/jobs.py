from argparse import ArgumentError
from sqlalchemy.orm import  joinedload,selectinload,Query
from models import Job
from sqlalchemy.future import select
from sqlalchemy import delete,update,func
from sqlalchemy.ext.asyncio import AsyncSession


class JobAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db
    
    async def get_one_async(self, job_id: int) -> Job:
        q:Query = select(Job)
        q = q.options(selectinload(Job.job_histories),selectinload(Job.employees))\
            .filter(Job.job_id == job_id).limit(1)
        results = await self._db.execute(q)
        return results.scalars().first()

    async def title_exist_async(self, job_title: str) -> bool:
        # TESTING 
        q:Query = select(func.count(Job.job_id).label("count")).filter(Job.job_title == job_title)
        result = await self._db.execute(q)
        return result.scalar() > 0
        # return self._db.query(Job)\
        #     .filter(Job.job_title == job_title)\
        #     .count() > 0

    async def get_all_async(self, skip: int = 0, limit: int = 0) -> list[Job]:
        q:Query = select(Job)
        q = q.offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def create_one_async(self, job: Job):
        if not isinstance(job, Job):
            raise TypeError(job, "job must be of type Job")
        self._db.add(job)

    async def update_one_async(self, job: Job):
        if not isinstance(job, Job):
            raise TypeError(job, "job must be of type Job")

        attrs = {column: getattr(job, column) for column in Job.__table__.columns.keys()}
        c = update(Job)\
                .where(Job.job_id == job.job_id)\
                .values(**attrs)\
                .execution_options(synchronize_session="fetch")
        await self._db.execute(c)

    async def delete_one_async(self, job_id: int):
        c = delete(Job).where(Job.job_id==job_id)
        await self._db.execute(c)