from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query

from ..services.unit_of_work import UnitOfWork
from ..mappers.job_history_mapper import JobHistoryMapper
from ..DTOs.job_histories import JobHistoryCreate, JobHistoryDTO,JobHistoryUpdate
from ..models import JobHistory
from ..dependencies import get_job_history_mapper, get_unit_of_work

router = APIRouter(
    prefix="/job_histories",
    tags=["job histories"],
    responses={404: {
        "decription": "Specific Job History cannot be found."
    }}
)


@router.get("/", response_model=list[JobHistoryDTO])
def get_all(
        skip: int = 0, limit: int = 100, employee_id: int = 0, department_id: int = 0, job_id: int = 0,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork = Depends(get_unit_of_work)):

    histories = uow.job_histories.get_all(
        employee_id=employee_id, skip=skip, limit=limit, job_id=job_id, department_id=department_id)
    dtos = list(map(job_history_mapper.from_model_to_dto, histories))
    return dtos


@router.get("/{employee_id}", response_model=JobHistoryDTO)
def get_last(
        employee_id: int,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork = Depends(get_unit_of_work)):

    result_list = uow.job_histories.get_all(employee_id, limit=1)
    if len(result_list)==0:
        raise HTTPException(status_code=404)
    history = result_list[0]
    dto = job_history_mapper.from_model_to_dto(history)
    return dto


@router.post("/",status_code=201,response_model=JobHistoryDTO)
def create_one(
    create_dto: JobHistoryCreate,
    job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
    uow: UnitOfWork = Depends(get_unit_of_work)):

    employee = uow.employees.get_one(employee_id=create_dto.employee_id)
    if employee is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if employee does not exist"})

    job = uow.jobs.get_one(job_id=create_dto.job_id)
    if job is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if job does not exist"})

    department = uow.departments.get_one(department_id=create_dto.department_id)
    if department is None:
        raise HTTPException(status_code =400,detail={"description":"cannot create a history if department does not exist"})

    # checks the last history of the employee
    hist = uow.job_histories.get_all(employee_id=create_dto.employee_id,limit=1)
    if len(hist): 
        # if there is a record before make the old end_date = new start_date 
        last =hist[0]
        last.end_date = create_dto.start_date
        uow.job_histories.update_one(last)
    
    job_history = job_history_mapper.from_create_to_model(create_dto)

    uow.job_histories.create_one(job_history)
    
    employee.department_id = create_dto.department_id
    employee.salary = create_dto.salary
    employee.job_id = create_dto.job_id
    if employee.hire_date is None:
        employee.hire_date = create_dto.start_date
    uow.employees.update_one(employee)
    uow.commit_refresh([job_history])

    dto = job_history_mapper.from_model_to_dto(job_history)
    return dto

@router.put("/",response_model=JobHistoryDTO)
def update_one(update_dto:JobHistoryUpdate,
        job_history_mapper: JobHistoryMapper = Depends(get_job_history_mapper),
        uow: UnitOfWork = Depends(get_unit_of_work)):
        history = uow.job_histories.get_one(update_dto.employee_id,update_dto.start_date)
        if history is None:
            raise HTTPException(status_code=404)
        history = job_history_mapper.from_update_to_model(update_dto,history)
        uow.job_histories.update_one(history)
        uow.commit_refresh([history])
        dto = job_history_mapper.from_model_to_dto(history)
        return dto

@router.delete("/{employee_id}/{start_date}",status_code=204)
def delete_one(employee_id:int,start_date:datetime,
        uow: UnitOfWork = Depends(get_unit_of_work)):
        uow.job_histories.delete_one(employee_id,start_date)
        # TODO if it is the last job_history then we should update our employee
        uow.commit_refresh([])
