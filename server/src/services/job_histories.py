from argparse import ArgumentTypeError
from datetime import datetime
from sqlalchemy.orm import Session, joinedload,selectinload,Query
from sqlalchemy import update,delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import JobHistory


class JobHistoriesService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, employee_id: int, start_date: datetime) -> JobHistory:
        job_history = self._db.query(JobHistory)\
            .options(joinedload(JobHistory.employee),
                     joinedload(JobHistory.job),
                     joinedload(JobHistory.department))\
            .filter(JobHistory.employee_id == employee_id,
                    JobHistory.start_date == start_date)\
            .first()
        return job_history

    def get_all(self, employee_id: int, skip: int = 0, limit: int = 100, department_id: int = 0, job_id: int = 0) -> list[JobHistory]:
        q = self._db.query(JobHistory)\
            .options(joinedload(JobHistory.employee)
                    ,joinedload(JobHistory.department)
                    ,joinedload(JobHistory.job)
                    )\
            # .join(JobHistory.job,)
        if employee_id:
            q = q.filter(JobHistory.employee_id == employee_id)
        if department_id:
            q = q.filter(JobHistory.department_id == department_id)
        if job_id:
            q = q.filter(JobHistory.job_id == job_id)
        return q.order_by(JobHistory.start_date.desc()).offset(skip).limit(limit).all()

    def create_one(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise ArgumentTypeError(job_history)
        self._db.add(job_history)

    def update_one(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise ArgumentTypeError(job_history)
        self._db.query(JobHistory).filter(
            JobHistory.start_date == job_history.start_date,
            JobHistory.employee_id == job_history.employee_id)\
            .update({column: getattr(job_history, column) for column in JobHistory.__table__.columns.keys()})

    def delete_one(self, employee_id: int, start_date: datetime):
        self._db.query(JobHistory)\
            .filter(JobHistory.employee_id == employee_id,
                    JobHistory.start_date == start_date)\
            .delete()

class JobHistoryAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db

    async def get_one_async(self, employee_id: int, start_date: datetime) -> JobHistory:
        q : Query = select(JobHistory)
        q = q.options(
            selectinload(JobHistory.employee),
            selectinload(JobHistory.job),
            selectinload(JobHistory.department))\
            .filter(JobHistory.employee_id == employee_id,JobHistory.start_date == start_date)\
            .limit(1)
        
        results = await self._db.execute(q)
        return results.scalars().first()

    async def get_all_async(self, employee_id: int, skip: int = 0, limit: int = 100, department_id: int = 0, job_id: int = 0) -> list[JobHistory]:
        q : Query = select(JobHistory)
        q = q.options(
            selectinload(JobHistory.employee),
            selectinload(JobHistory.department),
            selectinload(JobHistory.job))
        
        if employee_id:
            q = q.filter(JobHistory.employee_id == employee_id)
        if department_id:
            q = q.filter(JobHistory.department_id == department_id)
        if job_id:
            q = q.filter(JobHistory.job_id == job_id)
        q = q.order_by(JobHistory.start_date.desc()).offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def create_one_async(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise ArgumentTypeError(job_history)
        self._db.add(job_history)

    async def update_one_async(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise ArgumentTypeError(job_history)
        attrs = {column: getattr(job_history, column) for column in JobHistory.__table__.columns.keys()}
        c = update(JobHistory)\
            .where(
                JobHistory.start_date == job_history.start_date,
                JobHistory.employee_id == job_history.employee_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")

        await self._db.execute(c)

    async def delete_one_async(self, employee_id: int, start_date: datetime):
        c = delete(JobHistory).where(JobHistory.employee_id==employee_id,JobHistory.start_date==start_date)
        await self._db.execute(c)