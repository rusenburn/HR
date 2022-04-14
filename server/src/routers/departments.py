from fastapi import APIRouter, Depends, Query, HTTPException

from ..DTOs.nested import DepartmentNested

from ..services.unit_of_work import UnitOfWork
from ..dependencies import get_department_mapper, get_unit_of_work
from ..mappers.department_mapper import DepartmentMapper
from ..DTOs.departments import DepartmentDTO, DepartmentCreate, DepartmentUpdate


router = APIRouter(
    prefix="/departments",
    tags=["departments"],
    responses={
        404: {"description": "Department not found"}
    })


@router.get("/{department_id}", response_model=DepartmentDTO)
def get_one(department_id: int,
            department_mapper: DepartmentMapper = Depends(
                get_department_mapper),
            uow: UnitOfWork = Depends(get_unit_of_work)
            ):
    department = uow.departments.get_one(department_id)
    if department is None:
        raise HTTPException(status_code=404)
    dto = department_mapper.from_model_to_dto(department)
    return dto


@router.get("/", response_model=list[DepartmentNested])
def get_all(limit: int = Query(100),
            skip: int = Query(0),
            location_id: int = Query(0),
            department_mapper: DepartmentMapper = Depends(
                get_department_mapper),
            uow: UnitOfWork = Depends(get_unit_of_work)
            ):
    departments = uow.departments.get_all(
        location_id=location_id, skip=skip, limit=limit)
    dtos = [department_mapper.from_model_to_nested(d) for d in departments]
    return dtos


@router.post("/", response_model=DepartmentDTO, status_code=201)
def create_one(department_create: DepartmentCreate,
               department_mapper: DepartmentMapper = Depends(
                   get_department_mapper),
               uow: UnitOfWork = Depends(get_unit_of_work)
               ):
    department = department_mapper.from_create_to_model(department_create)
    uow.departments.create_one(department)
    uow.commit_refresh([department])
    dto = department_mapper.from_model_to_dto(department)
    return dto


@router.put("/",response_model=DepartmentDTO)
def update_one(department_update: DepartmentUpdate,
               department_mapper: DepartmentMapper = Depends(
                   get_department_mapper),
               uow: UnitOfWork = Depends(get_unit_of_work)):
    department = uow.departments.get_one(department_update.department_id)
    if department is None:
        raise HTTPException(status_code=404)
    
    department = department_mapper.from_update_to_model(department_update,department)
    uow.departments.update_one(department)
    uow.commit_refresh([department])
    
    dto = department_mapper.from_model_to_dto(department)
    return dto


@router.delete("/{department_id}",status_code=204)
def delete_one(department_id:int,
               uow: UnitOfWork = Depends(get_unit_of_work)):
    uow.departments.delete_one(department_id)
    uow.commit_refresh()

    
