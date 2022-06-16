from fastapi import APIRouter, Depends, HTTPException, Query

from ..services.redis_cache import RedisCacheService



from ..models import Employee
from ..DTOs.employees import EmployeeCreate, EmployeeDTO, EmployeeUpdate
from ..DTOs.nested import EmployeeNested
from ..mappers.employee_mapper import EmployeeMapper
from ..services.unit_of_work import UnitOfWork0
from ..services import UnitOfWork
from ..dependencies import get_cache_service, get_employee_mapper, get_employee_query, get_unit_of_work, get_unit_of_work_async


router = APIRouter(
    prefix="/employees",
    tags=["Employees"],
    responses={
        404: {"description": "Employee cannot be found"}
    }
)


@router.get("/", response_model=list[EmployeeNested])
async def get_all(
            uow: UnitOfWork0 = Depends(get_unit_of_work_async),
            employeeQuery=Depends(get_employee_query),
            cached:RedisCacheService=Depends(get_cache_service),
            employee_mapper: EmployeeMapper = Depends(get_employee_mapper)):
    employees = await cached.get_employees()
    if employees is None:
        employees = await uow.employees.get_all_async(**employeeQuery)
        await cached.set_employees(employees)
    dtos = [employee_mapper.from_model_to_nested(e) for e in employees]
    return dtos


@router.get("/{employee_id}", response_model=EmployeeDTO)
async def get_one(employee_id: int,
            uow: UnitOfWork0 = Depends(get_unit_of_work_async),
            employee_mapper: EmployeeMapper = Depends(get_employee_mapper)
            ):

    employee = await uow.employees.get_one_async(employee_id)
    if employee is None:
        raise HTTPException(status_code=404)

    dto = employee_mapper.from_model_to_dto(employee)
    return dto


@router.post("/", response_model=EmployeeNested, status_code=201)
async def create_one(create_dto: EmployeeCreate,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               employee_mapper: EmployeeMapper = Depends(get_employee_mapper)
               ):
    employee = employee_mapper.from_create_to_model(create_dto)
    await uow.employees.create_one_async(employee)
    await uow.commit_async(employee)
    dto = employee_mapper.from_model_to_nested(employee)
    return dto


@router.put("/", response_model=EmployeeNested)
async def update_one(update_dto: EmployeeUpdate,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               employee_mapper: EmployeeMapper = Depends(get_employee_mapper)):
    employee = await uow.employees.get_one_async(update_dto.employee_id)
    if employee is None:
        raise HTTPException(status_code=404)

    employee = employee_mapper.from_update_to_model(update_dto, employee)
    await uow.employees.update_one_async(employee)
    await uow.commit_async(employee)
    dto = employee_mapper.from_model_to_nested(employee)
    return dto


@router.delete("/{employee_id}", status_code=204)
async def delete_one(employee_id: int,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async),
               ):
    await uow.employees.delete_one_async(employee_id)
    await uow.commit_async()
