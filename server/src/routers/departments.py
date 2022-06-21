from fastapi import APIRouter, Depends, Query, HTTPException


from DTOs.nested import DepartmentNested
from services.redis_cache import RedisCacheService
from services.unit_of_work import UnitOfWork, UnitOfWork0
from dependencies import get_cache_service, get_department_mapper, get_unit_of_work, get_unit_of_work_async, require_admin_user,get_department_query
from mappers.department_mapper import DepartmentMapper
from DTOs.departments import DepartmentDTO, DepartmentCreate, DepartmentUpdate


router = APIRouter(
    prefix="/departments",
    tags=["departments"],
    responses={
        404: {"description": "Department not found"}
    },
    dependencies=[Depends(require_admin_user)])


@router.get("/{department_id}", response_model=DepartmentDTO)
async def get_one(department_id: int,
            department_mapper: DepartmentMapper = Depends(
                get_department_mapper),
            uow: UnitOfWork0 = Depends(get_unit_of_work_async)
            ):
    department = await uow.departments.get_one_async(department_id)
    if department is None:
        raise HTTPException(status_code=404)
    dto = department_mapper.from_model_to_dto(department)
    return dto


@router.get("/", response_model=list[DepartmentNested])
async def get_all(
            query:dict=Depends(get_department_query),
            department_mapper: DepartmentMapper = Depends(
                get_department_mapper),
            uow: UnitOfWork0 = Depends(get_unit_of_work_async),
            cached:RedisCacheService=Depends(get_cache_service)
            ):
    departments = await cached.get_departments()
    if departments is None:
        departments = await uow.departments.get_all_async(**query)
        await cached.set_departments(departments)
    dtos = [department_mapper.from_model_to_nested(d) for d in departments]
    return dtos


@router.post("/", response_model=DepartmentNested, status_code=201)
async def create_one(department_create: DepartmentCreate,
               department_mapper: DepartmentMapper = Depends(
                   get_department_mapper),
               uow: UnitOfWork0 = Depends(get_unit_of_work_async)
               ):
    location = await uow.locations.get_one_async(department_create.location_id)
    if location is None:
        raise HTTPException(status_code=400)
    department = department_mapper.from_create_to_model(department_create)
    
    await uow.departments.create_one_async(department)
    await uow.commit_async()
    dto = department_mapper.from_model_to_nested(department)
    return dto


@router.put("/",response_model=DepartmentNested)
async def update_one(department_update: DepartmentUpdate,
               department_mapper: DepartmentMapper = Depends(
                   get_department_mapper),
               uow: UnitOfWork0 = Depends(get_unit_of_work_async)):
    department = await uow.departments.get_one_async(department_update.department_id)
    if department is None:
        raise HTTPException(status_code=404)
    
    location = await uow.locations.get_one_async(department_update.location_id)
    if location is None:
        raise HTTPException(status_code=400)
    department = department_mapper.from_update_to_model(department_update,department)
    await uow.departments.update_one_async(department)
    await uow.commit_async()
    
    dto = department_mapper.from_model_to_nested(department)
    return dto


@router.delete("/{department_id}",status_code=204)
async def delete_one(department_id:int,
               uow: UnitOfWork0 = Depends(get_unit_of_work_async)):
    department = await uow.departments.get_one_async(department_id)
    if department is None:
        raise HTTPException(status_code=404)
    await uow.departments.delete_one_async(department_id)
    await uow.commit_async()

    
