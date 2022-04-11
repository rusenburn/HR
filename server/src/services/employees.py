from argparse import ArgumentError
from sqlalchemy.orm import Session
from ..models import Employee

class EmployeesService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, employee_id: int) -> Employee:
        return self._db.query(Employee)\
            .filter(Employee.employee_id == employee_id)\
            .first()

    def get_all(self, *, department_id=0, job_id=0, manager_id=0, skip=0, limit=100):
        q = self._db.query(Employee)
        if department_id:
            q = q.filter(Employee.department_id == department_id)
        if job_id:
            q = q.filter(Employee.job_id == job_id)
        if manager_id:
            q = q.filter(Employee.manager_id == manager_id)
        return q.offset(skip).limit(limit).all()

    def create_one(self, employee: Employee):
        if not isinstance(employee, Employee):
            raise ArgumentError(
                employee, f"argument type is invalid {employee}")
        self._db.add(employee)

    def update_one(self, employee: Employee):
        if not isinstance(employee, Employee):
            raise ArgumentError(
                employee, f"argument type is invalid {employee}")
        self._db.query(Employee)\
            .filter(Employee.employee_id == employee.employee_id)\
            .update({column: getattr(employee, column) for column in Employee.__table__.columns.keys()})

    def delete_one(self, employee_id: int):
        self._db.query(Employee)\
            .filter(Employee.employee_id == employee_id)\
            .delete()
