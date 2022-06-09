from argparse import ArgumentError
from sqlalchemy.orm import Session, joinedload
from ..models import Department


class DepartmentsService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_all(self, location_id: int = 0, skip: int = 0, limit: int = 100) -> list[Department]:
        q = self._db.query(Department)\


        if location_id > 0:
            q = q.filter(Department.location_id == location_id)

        return q.offset(skip).limit(limit).all()

    def get_one(self, department_id: int) -> Department:
        return self._db.query(Department)\
            .options(joinedload(Department.location),
                     joinedload(Department.employees),
                     joinedload(Department.job_histories))\
            .filter(Department.department_id == department_id)\
            .first()

    def create_one(self, department: Department):
        if not isinstance(department, Department):
            raise ArgumentError(
                department, f"argument type is invalid {department}")
        self._db.add(department)

    def update_one(self, department: Department):
        if not isinstance(department, Department):
            raise ArgumentError(department, "Must be a Department type")

        self._db.query(Department)\
            .filter(Department.department_id == department.department_id)\
            .update({column: getattr(department, column) for column in Department.__table__.columns.keys()})

    def delete_one(self, department_id):
        self._db.query(Department)\
            .filter(Department.department_id == department_id)\
            .delete()       