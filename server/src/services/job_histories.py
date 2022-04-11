from argparse import ArgumentTypeError
from datetime import datetime
from sqlalchemy.orm import Session

from ..models import JobHistory


class JobHistoriesService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, employee_id: int, start_date: datetime) -> JobHistory:
        job_history = self._db.query(JobHistory)\
            .filter(JobHistory.employee_id == employee_id,
                    JobHistory.start_date == start_date)\
            .first()
        return job_history

    def get_all(self, employee_id: int, skip: int = 0, limit: int = 100, department_id: int = 0, job_id: int = 0)->list[JobHistory]:
        q = self._db.query(JobHistory)
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
