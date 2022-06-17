from argparse import ArgumentError
from sqlalchemy.orm import Session, joinedload,selectinload,Query
from sqlalchemy import update,delete
from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from models import Employee


class EmployeesService():
    def __init__(self, db: Session) -> None:
        self._db = db

    def get_one(self, employee_id: int) -> Employee:
        return self._db.query(Employee)\
            .options(
                joinedload(Employee.department),
                joinedload(Employee.job_histories),
                joinedload(Employee.manager),
                joinedload(Employee.job),
                joinedload(Employee.employees),)\
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


class EmployeeAsyncService:
    def __init__(self,db:AsyncSession) -> None:
        self._db = db
    
    async def get_one_async(self, employee_id: int) -> Employee:
        q : Query = select(Employee)
        q = q.options(
                selectinload(Employee.department),
                selectinload(Employee.job_histories),
                selectinload(Employee.manager),
                selectinload(Employee.job),
                selectinload(Employee.employees))\
            .filter(Employee.employee_id == employee_id)\
            .limit(1)
        results = await self._db.execute(q)
        return results.scalars().first()

    async def get_all_async(self, *, department_id=0, job_id=0, manager_id=0, skip=0, limit=100):
        q:Query = select(Employee)
        if department_id:
            q = q.filter(Employee.department_id == department_id)
        if job_id:
            q = q.filter(Employee.job_id == job_id)
        if manager_id:
            q = q.filter(Employee.manager_id == manager_id)
        q = q.offset(skip).limit(limit)
        results = await self._db.execute(q)
        return results.scalars().all()

    async def create_one_async(self, employee: Employee):
        if not isinstance(employee, Employee):
            raise ArgumentError(
                employee, f"argument type is invalid {employee}")
        self._db.add(employee)

    async def update_one_async(self, employee: Employee):
        if not isinstance(employee, Employee):
            raise ArgumentError(
                employee, f"argument type is invalid {employee}")
        attrs = {column: getattr(employee, column) for column in Employee.__table__.columns.keys()}
        c = update(Employee)\
            .where(Employee.employee_id == employee.employee_id)\
            .values(**attrs)\
            .execution_options(synchronize_session="fetch")
        await self._db.execute(c)

    async def delete_one_async(self, employee_id: int):
        c = delete(Employee).where(Employee.employee_id == employee_id)
        await self._db.execute(c)