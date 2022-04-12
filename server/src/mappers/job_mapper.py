from ..DTOs.jobs import JobCreate,JobDTO,JobUpdate
from ..models import Job
from .nested_mapper import NestedMapper
class JobMapper():
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested
    
    def from_model_to_dto(self,job:Job)->JobDTO:
        dto = JobDTO(
            job_id=job.job_id,
            job_title=job.job_title,
            min_salary=job.min_salary,
            max_salary=job.max_salary,
            employees=list(map(self._nested.to_employee_nested,job.employees)),
            job_histories=list(map(self._nested.to_job_history_nested,job.job_histories))
            )
        return dto
    
    def from_create_to_model(self,create_dto :JobCreate)->Job:
        job = Job()
        job.job_title = create_dto.job_title
        job.min_salary = create_dto.min_salary
        job.max_salary = create_dto.max_salary
        return job
    
    def from_update_to_model(self,update_dto:JobUpdate,job:Job)->Job:
        # job.job_id = update_dto.job_id
        job.job_title = update_dto.job_title
        job.min_salary = update_dto.min_salary
        job.max_salary=update_dto.max_salary
        return job
    
        