from fastapi import APIRouter, Depends, Query, HTTPException
from ..DTOs.jobs import JobDTO, JobCreate, JobUpdate
from ..models import Job
from ..services import UnitOfWork
from ..mappers.job_mapper import JobMapper
from ..dependencies import get_job_mapper, get_unit_of_work

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    responses={404: {"description": "Job cannot be found"}}
)


@router.get("/", response_model=list[JobDTO])
def get_all(
        skip: int = Query(0, ge=0),
        limit: int = Query(100, ge=0),
        uow: UnitOfWork = Depends(get_unit_of_work),
        job_mapper: JobMapper = Depends(get_job_mapper)):

    jobs = uow.jobs.get_all(skip=skip, limit=limit)
    dtos = [job_mapper.from_model_to_dto(j) for j in jobs]
    return dtos


@router.get("/job_id", response_model=JobDTO)
def get_one(job_id: int,
            uow: UnitOfWork = Depends(get_unit_of_work),
            job_mapper: JobMapper = Depends(get_job_mapper)
            ):
    job = uow.jobs.get_one(job_id)
    dto = job_mapper.from_model_to_dto(job)
    return dto

@router.post("/", response_model=JobDTO, status_code=201)
def create_one(job_create: JobCreate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               job_mapper: JobMapper = Depends(get_job_mapper)
               ):
    if uow.jobs.title_exist(job_create.job_title):
        raise HTTPException(status_code=400, detail={
            "description": f"job_title: {job_create.job_title} must be unique"})

    job = job_mapper.from_create_to_model(job_create)
    uow.jobs.create_one(job)
    uow.commit_refresh(items=[job])
    dto = job_mapper.from_model_to_dto(job)
    return dto

@router.put("/", response_model=JobDTO)
def update_one(job_update: JobUpdate,
               uow: UnitOfWork = Depends(get_unit_of_work),
               job_mapper: JobMapper = Depends(get_job_mapper)
               ):
    job = uow.jobs.get_one(job_update.job_id)
    if job_update.job_title.lower() != job.job_title.lower():
        if uow.jobs.title_exist(job_update.job_title):
            raise HTTPException(
                400, detail={"description": f"job_title: {job_update.job_title} must be unique"})
    job = job_mapper.from_update_to_model(job_update, job)
    uow.jobs.update_one(job)
    uow.commit_refresh(items=[job])
    dto = job_mapper.from_model_to_dto(job)
    return dto

@router.delete("/job_id", status_code=204)
def delete_one(job_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work),
               ):
    uow.jobs.delete_one(job_id)
    uow.commit_refresh()
