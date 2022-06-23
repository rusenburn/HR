from fastapi import APIRouter, Depends, Query, HTTPException

from services.redis_cache import RedisCacheService
from services.unit_of_work import UnitOfWork

from models import Job
from DTOs.jobs import JobDTO, JobCreate, JobUpdate
from DTOs.nested import JobNested
from mappers.job_mapper import JobMapper
from dependencies import get_cache_service, get_job_mapper,get_base_query, get_unit_of_work_async, require_admin_user

router = APIRouter(
    prefix="/jobs",
    tags=["jobs"],
    responses={404: {"description": "Job cannot be found"}},
    dependencies=[Depends(require_admin_user)]
)


@router.get("/", response_model=list[JobNested])
async def get_all(
        uow: UnitOfWork = Depends(get_unit_of_work_async),
        job_mapper: JobMapper = Depends(get_job_mapper),
        cached:RedisCacheService=Depends(get_cache_service),
        query=Depends(get_base_query)):
    jobs = await cached.get_jobs()
    if jobs is None:
        jobs = await uow.jobs.get_all_async(**query)
        await cached.set_jobs(jobs)
    dtos = [job_mapper.from_model_to_nested(j) for j in jobs]
    return dtos


@router.get("/{job_id}", response_model=JobDTO)
async def get_one(job_id: int,
            uow: UnitOfWork = Depends(get_unit_of_work_async),
            job_mapper: JobMapper = Depends(get_job_mapper)
            ):
    job = await uow.jobs.get_one_async(job_id)
    if job is None:
        raise HTTPException(status_code=404)
    dto = job_mapper.from_model_to_dto(job)
    return dto

@router.post("/", response_model=JobNested, status_code=201)
async def create_one(job_create: JobCreate,
               uow: UnitOfWork = Depends(get_unit_of_work_async),
               job_mapper: JobMapper = Depends(get_job_mapper)
               ):
    if await uow.jobs.title_exist_async(job_create.job_title):
        raise HTTPException(status_code=400, detail={
            "description": f"job_title: {job_create.job_title} must be unique"})

    job = job_mapper.from_create_to_model(job_create)
    await uow.jobs.create_one_async(job)
    await uow.commit_async()
    dto = job_mapper.from_model_to_nested(job)
    return dto

@router.put("/", response_model=JobNested)
async def update_one(job_update: JobUpdate,
               uow: UnitOfWork = Depends(get_unit_of_work_async),
               job_mapper: JobMapper = Depends(get_job_mapper)
               ):
    job = await uow.jobs.get_one_async(job_update.job_id)
    if job is None:
        raise HTTPException(status_code=404)
    if job_update.job_title.lower() != job.job_title.lower():
        if await uow.jobs.title_exist_async(job_update.job_title):
            raise HTTPException(
                400, detail={"description": f"job_title: {job_update.job_title} must be unique"})
    job = job_mapper.from_update_to_model(job_update, job)
    await uow.jobs.update_one_async(job)
    await uow.commit_async()
    dto = job_mapper.from_model_to_nested(job)
    return dto

@router.delete("/{job_id}", status_code=204)
async def delete_one(job_id: int,
               uow: UnitOfWork = Depends(get_unit_of_work_async),
               ):
    await uow.jobs.delete_one_async(job_id)
    await uow.commit_async()
