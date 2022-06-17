from models import Department
from DTOs.nested import DepartmentNested
from DTOs.departments import DepartmentCreate,DepartmentUpdate,DepartmentDTO
from .nested_mapper import NestedMapper

class DepartmentMapper():
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested
    
    def from_update_to_model(self,update_dto:DepartmentUpdate,department:Department)->Department:
        department.department_id = update_dto.department_id
        department.department_name = update_dto.department_name
        department.location_id = update_dto.location_id
        return department
    
    def from_create_to_model(self,create_dto:DepartmentCreate)->Department:
        department = Department()
        department.department_name = create_dto.department_name
        department.location_id = create_dto.location_id
        return department
    
    def from_model_to_dto(self,department:Department)->DepartmentDTO:
        dto = DepartmentDTO(
            department_id=department.department_id,
            department_name=department.department_name,
            location_id=department.location_id,
            employees=list(map(self._nested.to_employee_nested,department.employees)),
            job_histories=list(map(self._nested.to_job_history_nested,department.job_histories)),
            location=self._nested.to_location_nested(department.location))
            
        return dto
    
    def from_model_to_nested(self,department:Department)->DepartmentNested:
        return self._nested.to_department_nested(department)

    
