from fastapi import APIRouter, Depends, Query, HTTPException

from ..models import Job
from ..DTOs.jobs import JobDTO, JobCreate, JobUpdate
from ..DTOs.nested import JobNested
from ..mappers.job_mapper import JobMapper
from ..dependencies import get_job_mapper, get_unit_of_work,get_base_query
from ..services import UnitOfWork

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    responses={404: {"description": "Job cannot be found"}}
)


@router.get("/", response_model=list[JobNested])
def get_all(
        # skip: int = Query(0, ge=0),
        # limit: int = Query(100, ge=0),
        uow: UnitOfWork = Depends(get_unit_of_work),
        job_mapper: JobMapper = Depends(get_job_mapper),
        query=Depends(get_base_query)):

    jobs = uow.jobs.get_all(**query)
    dtos = [job_mapper.from_model_to_nested(j) for j in jobs]
    return dtos


@router.get("/{job_id}", response_model=JobDTO)
def get_one(job_id: int,
            uow: UnitOfWork = Depends(get_unit_of_work),
            job_mapper: JobMapper = Depends(get_job_mapper)
            ):
    job = uow.jobs.get_one(job_id)
    dto = job_mapper.from_model_to_dto(job)
    return dto

@router.post("/", response_model=JobNested, status_code=201)
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
    dto = job_mapper.from_model_to_nested(job)
    return dto

@router.put("/", response_model=JobNested)
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
    dto = job_mapper.from_model_to_nested(job)
    return dto

@router.delete("/{job_id}", status_code=204)
def delete_one(job_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work),
               ):
    uow.jobs.delete_one(job_id)
    uow.commit_refresh()
