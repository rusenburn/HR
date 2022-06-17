from models import Employee
from DTOs.nested import EmployeeNested
from DTOs.employees import EmployeeCreate, EmployeeDTO, EmployeeUpdate
from .nested_mapper import NestedMapper

class EmployeeMapper:
    def __init__(self,nested:NestedMapper) -> None:
        self._nested = nested

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
            department_id=employee.department_id,
            manager=self._nested.to_employee_nested(employee.manager),
            employees=list(map(self._nested.to_employee_nested,employee.employees)),
            department=self._nested.to_department_nested(employee.department),
            job=self._nested.to_job_nested(employee.job),
            job_histories=[self._nested.to_job_history_nested(j) for j in employee.job_histories]
            )
        return dto

    def from_create_to_model(self, create_dto: EmployeeCreate) -> Employee:
        employee = Employee()
        employee.first_name = create_dto.first_name
        employee.last_name = create_dto.last_name
        employee.email = create_dto.email
        employee.phone_number = create_dto.phone_number
        return employee

    def from_update_to_model(self, update_dto: EmployeeUpdate, employee: Employee) -> Employee:
        employee.first_name = update_dto.first_name
        employee.last_name = update_dto.last_name
        employee.email = update_dto.email
        employee.phone_number = update_dto.phone_number
        employee.manager_id = update_dto.manager_id
        return employee
    
    def from_model_to_nested(self,employee:Employee)->EmployeeNested:
        return self._nested.to_employee_nested(employee)
