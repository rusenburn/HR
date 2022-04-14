from argparse import ArgumentError
from sqlalchemy.orm import Session, joinedload
from ..models import Job


class JobsService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, job_id: int) -> Job:
        return self._db.query(Job)\
            .options(joinedload(Job.job_histories), joinedload(Job.employees))\
            .filter(Job.job_id == job_id)\
            .first()

    def title_exist(self, job_title: str) -> bool:
        return self._db.query(Job)\
            .filter(Job.job_title == job_title)\
            .count() > 0

    def get_all(self, skip: int = 0, limit: int = 0) -> list[Job]:
        jobs = self._db.query(Job).offset(skip).limit(limit)
        return jobs

    def create_one(self, job: Job):
        if not isinstance(job, Job):
            raise ArgumentError(job, "job must be of type Job")
        self._db.add(job)

    def update_one(self, job: Job):
        if not isinstance(job, Job):
            raise ArgumentError(job, "job must be of type Job")
        self._db.query(Job)\
            .filter(Job.job_id == job.job_id)\
            .update({column: getattr(job, column) for column in Job.__table__.columns.keys()})

    def delete_one(self, job_id: int):
        self._db.query(Job)\
                .filter(Job.job_id == job_id)\
                .delete()
