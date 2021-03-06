from models import JobHistory,Employee
from DTOs.nested import JobHistoryNested
from DTOs.job_histories import JobHistoryCreate,JobHistoryDTO,JobHistoryUpdate
from .nested_mapper import NestedMapper

class JobHistoryMapper():
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested
    
    def from_create_to_model(self,create_dto:JobHistoryCreate)->JobHistory:
        job_history = JobHistory()
        job_history.employee_id = create_dto.employee_id
        job_history.start_date = create_dto.start_date
        job_history.salary = create_dto.salary
        job_history.job_id = create_dto.job_id
        job_history.department_id = create_dto.department_id
        return job_history
    
    def from_model_to_dto(self,job_history:JobHistory)->JobHistoryDTO:
        dto = JobHistoryDTO(
            employee_id=job_history.employee_id,
            start_date=job_history.start_date,
            salary=job_history.salary,
            end_date=job_history.end_date,
            job_id=job_history.job_id,
            department_id=job_history.department_id,
            department=self._nested.to_department_nested(job_history.department),
            employee=self._nested.to_employee_nested(job_history.employee),
            job=self._nested.to_job_nested(job_history.job)
            )
        return dto
    
    def from_job_history_to_employee(self,job_history:JobHistory,employee:Employee)->Employee:
        employee.salary=job_history.salary
        employee.department_id=job_history.department_id
        employee.job_id=job_history.job_id
        return employee

    
    def from_update_to_model(self,update_dto:JobHistoryUpdate,job_history:JobHistory)->JobHistory:
        job_history.end_date = update_dto.end_date
        return job_history

    def from_model_to_nested(self,job_history:JobHistory)->JobHistoryNested:
        return self._nested.to_job_history_nested(job_history)    