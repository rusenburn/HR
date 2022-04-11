from ..DTOs.employees import EmployeeCreate, EmployeeDTO, EmployeeUpdate
from ..models import Employee


class EmployeeMapper:
    def __init__(self) -> None:
        ...

    def from_model_to_dto(self, employee: Employee) -> EmployeeDTO:
        dto = EmployeeDTO(
            employee_id=employee.employee_id,
            first_name=employee.first_name,
            last_name=employee.last_name,
            email=employee.email,
            phone_number=employee.phone_number,
            hire_date=employee.hire_date,
            salary=employee.salary,
            job_id=employee.job_id,
            manager_id=employee.manager_id,
            department_id=employee.department_id)
        return dto

    def from_create_to_model(self, create_dto: EmployeeCreate) -> Employee:
        employee = Employee()
        employee.first_name = create_dto.first_name
        employee.last_name = create_dto.last_name
        employee.email = create_dto.email
        employee.phone_number = create_dto.phone_number
        # employee.hire_date = create_dto.hire_date
        # employee.salary = create_dto.salary
        # employee.job_id = create_dto.job_id
        # employee.manager_id = create_dto.manager_id
        # employee.department_id = create_dto.department_id
        return employee

    def from_update_to_model(self, update_dto: EmployeeUpdate, employee: Employee) -> Employee:
        employee.first_name = update_dto.first_name
        employee.last_name = update_dto.last_name
        employee.email = update_dto.email
        employee.phone_number = update_dto.phone_number
        employee.manager_id = update_dto.manager_id
        # employee.salary = update_dto.salary
        # employee.job_id = update_dto.job_id
        # employee.department_id = update_dto.department_id
        return employee
