from datetime import datetime, tzinfo
from time import strftime
from copy import deepcopy
from sqlalchemy.orm import joinedload,selectinload,Query
from sqlalchemy import update,delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import JobHistory


class JobHistoryAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db

    async def get_one_async(self, employee_id: int, start_date: datetime) -> JobHistory:
        q : Query = select(JobHistory)
        formated_start_date =  start_date.strftime('%Y-%m-%d %H:%M:%S')
        q = q.options(
            selectinload(JobHistory.employee),
            selectinload(JobHistory.job),
            selectinload(JobHistory.department))\
            .filter(JobHistory.employee_id == employee_id,JobHistory.start_date == formated_start_date)\
            .limit(1)

        results = await self._db.execute(q)
        return results.scalars().first()

    async def get_all_async(self, employee_id: int, skip: int = 0, limit: int = 100, department_id: int = 0, job_id: int = 0) -> list[JobHistory]:
        q : Query = select(JobHistory)
        q = q.options(
            selectinload(JobHistory.employee),
            selectinload(JobHistory.department),
            selectinload(JobHistory.job))
        
        if employee_id and employee_id>0:
            q = q.filter(JobHistory.employee_id == employee_id)
        if department_id and department_id>0:
            q = q.filter(JobHistory.department_id == department_id)
        if job_id and job_id>0:
            q = q.filter(JobHistory.job_id == job_id)
        q = q.order_by(JobHistory.start_date.desc()).offset(skip).limit(limit)
        results = await self._db.execute(q)
        tz :list[JobHistory]= results.scalars().all()
        return tz

    async def create_one_async(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise TypeError(job_history)
        jh = deepcopy(job_history)
        jh.start_date = jh.start_date.strftime('%Y-%m-%d %H:%M:%S')
        self._db.add(jh)

    async def update_one_async(self, job_history: JobHistory):
        if not isinstance(job_history, JobHistory):
            raise TypeError(job_history)
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