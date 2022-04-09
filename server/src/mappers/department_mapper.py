from ..models import Department
from ..DTOs.departments import DepartmentCreate,DepartmentUpdate,DepartmentDTO


class DepartmentMapper():
    def __init__(self) -> None:
        ...
    
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
            location_id=department.location_id)
        return dto

    
