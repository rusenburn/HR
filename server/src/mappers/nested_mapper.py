from ..models import Region, Country, Department, Employee, Job, JobHistory, Location
from ..DTOs.nested import RegionNested,CountryNested,DepartmentNested,LocationNested,JobHistoryNested,JobNested,EmployeeNested


class NestedMapper:
    def __init__(self) -> None:
        ...

    def to_region_nested(self, region: Region) -> RegionNested | None:
        if region is None:
            return None
        dto = RegionNested(region_id=region.region_id,
                           region_name=region.region_name)
        return dto

    def to_country_nested(self, country: Country) -> CountryNested:
        dto = CountryNested(
            country_id=country.country_id,
            country_name=country.country_name,
            region_id=country.region_id)
        return dto

    def to_location_nested(self, location: Location) -> LocationNested | None:
        if location is None:
            return None
        dto = LocationNested(
            location_id=location.location_id,
            street_address=location.street_address,
            postal_code=location.postal_code,
            city=location.city,
            state_province=location.state_province,
            country_id=location.country_id)
        return dto

    def to_department_nested(self, department: Department) -> DepartmentNested | None:
        if department is None:
            return None
        dto = DepartmentNested(
            department_id=department.department_id,
            department_name=department.department_name,
            location_id=department.location_id)
        return dto

    def to_employee_nested(self, employee: Employee) -> EmployeeNested | None:
        if employee is None:
            return None
        dto = EmployeeNested(
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

    def to_job_nested(self, job: Job) -> JobHistoryNested | None:
        if job is None:
            return None
        dto = JobNested(
            job_id=job.job_id,
            job_title=job.job_title,
            min_salary=job.min_salary,
            max_salary=job.max_salary)
        return dto

    def to_job_history_nested(self, job_history: JobHistory) -> JobHistory | None:
        if job_history is None:
            return None
        dto = JobHistoryNested(
            employee_id=job_history.employee_id,
            start_date=job_history.start_date,
            salary=job_history.salary,
            end_date=job_history.end_date,
            job_id=job_history.job_id,
            department_id=job_history.department_id)
        return dto
