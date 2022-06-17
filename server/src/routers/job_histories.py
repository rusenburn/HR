from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from services.unit_of_work import UnitOfWork, UnitOfWork0
from mappers.job_history_mapper import JobHistoryMapper
from DTOs.job_histories import JobHistoryCreate, JobHistoryDTO,JobHistoryUpdate
from models import JobHistory
from dependencies import get_job_history_mapper, get_unit_of_work, get_unit_of_work_async, require_admin_user

router = APIRouter(
    prefix="/job-history",
    tags=["job histories"],
    responses={404: {
        "decription": "Specific Job History cannot be found."
    }},
    dependencies=[Depends(require_admin_user)]
)


@router.get("/", response_model=list[JobHistoryDTO])
async def get_all(
        skip: int = 0, limit: int = 100, employee_id: int = 0, department_id: int = 0, job_id: int = 0,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork0 = Depends(get_unit_of_work_async)):

    histories = await uow.job_history.get_all_async(
        employee_id=employee_id, skip=skip, limit=limit, job_id=job_id, department_id=department_id)
    dtos = list(map(job_history_mapper.from_model_to_dto, histories))
    return dtos


@router.get("/{employee_id}", response_model=JobHistoryDTO)
async def get_last(
        employee_id: int,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork0 = Depends(get_unit_of_work_async)):

    result_list = await uow.job_history.get_all_async(employee_id, limit=1)
    if len(result_list)==0:
        raise HTTPException(status_code=404)
    history = result_list[0]
    dto = job_history_mapper.from_model_to_dto(history)
    return dto


@router.post("/",status_code=201,response_model=JobHistoryDTO)
async def create_one(
    create_dto: JobHistoryCreate,
    job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
    uow: UnitOfWork0 = Depends(get_unit_of_work_async)):

    employee = await uow.employees.get_one_async(employee_id=create_dto.employee_id)
    if employee is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if employee does not exist"})

    job = await uow.jobs.get_one_async(job_id=create_dto.job_id)
    if job is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if job does not exist"})

    department = await uow.departments.get_one_async(department_id=create_dto.department_id)
    if department is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if department does not exist"})

    # checks the last history of the employee
    hist = await uow.job_history.get_all_async(employee_id=create_dto.employee_id,limit=1)
    if len(hist): 
        # if there is a record before make the old end_date = new start_date 
        last =hist[0]
        last.end_date = create_dto.start_date
        await uow.job_history.update_one_async(last)
    
    job_history = job_history_mapper.from_create_to_model(create_dto)

    await uow.job_history.create_one_async(job_history)
    
    employee.department_id = create_dto.department_id
    employee.salary = create_dto.salary
    employee.job_id = create_dto.job_id
    if employee.hire_date is None:
        employee.hire_date = create_dto.start_date
    await uow.employees.update_one_async(employee)
    await uow.commit_async()
    job_history = await uow.job_history.get_one_async(job_history.employee_id,job_history.start_date)
    dto = job_history_mapper.from_model_to_dto(job_history)
    
    return dto

@router.put("/",response_model=JobHistoryDTO)
async def update_one(update_dto:JobHistoryUpdate,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork0 = Depends(get_unit_of_work_async)):
        history = await uow.job_history.get_one_async(update_dto.employee_id,update_dto.start_date)
        if history is None:
            raise HTTPException(status_code=404)
        history = job_history_mapper.from_update_to_model(update_dto,history)
        await uow.job_history.update_one_async(history)
        await uow.commit_async(history)
        dto = job_history_mapper.from_model_to_dto(history)
        return dto

@router.delete("/{employee_id}/{start_date}",status_code=204)
async def delete_one(employee_id:int,start_date:datetime,
        uow: UnitOfWork0 = Depends(get_unit_of_work_async)):
        await uow.job_history.delete_one_async(employee_id,start_date)
        # TODO if it is the last job_history then we should update our employee
        await uow.commit_async()
