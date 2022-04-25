from fastapi import APIRouter, Depends, HTTPException, Query


from ..models import Employee
from ..DTOs.employees import EmployeeCreate, EmployeeDTO, EmployeeUpdate
from ..DTOs.nested import EmployeeNested
from ..mappers.employee_mapper import EmployeeMapper
from ..services import UnitOfWork
from ..dependencies import get_employee_mapper, get_unit_of_work


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
    responses={
        404: {"description": "Employee cannot be found"}
    }
)


@router.get("/", response_model=list[EmployeeNested])
def get_all(manager_id: int|None = Query(0), job_id: int|None = Query(0), department_id: int|None = Query(0),
            skip: int |None= Query(0), limit: int|None = Query(100),
            uow: UnitOfWork = Depends(get_unit_of_work),
            employee_mapper: EmployeeMapper = Depends(get_employee_mapper)):

    employees = uow.employees.get_all(
        department_id=department_id, job_id=job_id, manager_id=manager_id, skip=skip, limit=limit)

    dtos = [employee_mapper.from_model_to_nested(e) for e in employees]
    return dtos


@router.get("/{employee_id}", response_model=EmployeeDTO)
def get_one(employee_id: int,
            uow: UnitOfWork = Depends(get_unit_of_work),
            employee_mapper: EmployeeMapper = Depends(get_employee_mapper)
            ):

    employee = uow.employees.get_one(employee_id)
    if employee is None:
        raise HTTPException(status_code=404)

    dto = employee_mapper.from_model_to_dto(employee)
    return dto


@router.post("/", response_model=EmployeeNested, status_code=201)
def create_one(create_dto: EmployeeCreate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               employee_mapper: EmployeeMapper = Depends(get_employee_mapper)
               ):
    employee = employee_mapper.from_create_to_model(create_dto)
    uow.employees.create_one(employee)
    uow.commit_refresh([employee])
    dto = employee_mapper.from_model_to_nested(employee)
    return dto


@router.put("/", response_model=EmployeeNested)
def update_one(update_dto: EmployeeUpdate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               employee_mapper: EmployeeMapper = Depends(get_employee_mapper)):
    employee = uow.employees.get_one(update_dto.employee_id)
    if employee is None:
        raise HTTPException(status_code=404)

    employee = employee_mapper.from_update_to_model(update_dto, employee)
    uow.employees.update_one(employee)
    uow.commit_refresh([employee])
    dto = employee_mapper.from_model_to_nested(employee)
    return dto


@router.delete("/{employee_id}", status_code=204)
def delete_one(employee_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work),
               ):
    uow.employees.delete_one(employee_id)
    uow.commit_refresh()
