from pydantic import BaseModel
from models import Region,Country,Location,Department,Employee,Job,JobHistory
from DTOs.regions import RegionCreateDTO,RegionDTO,RegionUpdateDTO
from DTOs.countries import CountryCreateDTO,CountryDTO,CountryUpdateDTO
from DTOs.nested import RegionNested,CountryNested,LocationNested,DepartmentNested,EmployeeNested,JobHistoryNested,JobNested
from DTOs.locations import LocationCreate,LocationDTO,LocationUpdate
from DTOs.departments import DepartmentCreate,DepartmentDTO,DepartmentUpdate



class Factory:
    def __init__(self) -> None:
        self._current_region_id = 1
        self._current_country_id = 1
        self._current_location_id = 1
        self._current_department_id = 1
    def make_region(self)->Region:
        self._current_region_id+=1
        region =Region()
        region.region_name = "Asia"
        region.region_id = self._current_region_id
        region.countries = []
        return region

    def make_region_create_dto(self)->RegionCreateDTO:
        return RegionCreateDTO(regionName="Asia")

    def make_region_update_dto(self)->RegionUpdateDTO:
        return RegionUpdateDTO(regionId=1,regionName="Middle East")

    def make_region_dto(self)->RegionDTO:
        return RegionDTO(regionId=1,regionName="Asia",countries=[])
    
    def make_region_nested(self)->RegionNested:
        self._current_region_id+=1
        return RegionNested(regionId=self._current_region_id,regionName=f"region_{self._current_region_id}")
    
    def make_country(self)->Country:
        self._current_country_id+=1
        country = Country()
        country.country_id = self._current_country_id
        country.country_name = f"country_{self._current_country_id}"
        country.region_id = 0
        country.region = None
        country.locations = []
        return country
    
    def make_country_create_dto(self)->CountryCreateDTO:
        return CountryCreateDTO(countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)
    
    
    def make_country_dto(self)->CountryDTO:
        nested_region = self.make_region_nested()
        return CountryDTO(countryId=self._current_country_id,countryName=f'country_{self._current_country_id}',regionId=nested_region.region_id,region=nested_region,locations=[])
    
    def make_country_update_dto(self)->CountryUpdateDTO:
        return CountryUpdateDTO(countryId=self._current_country_id,countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)
    
    def make_country_nested(self)->CountryNested:
        return CountryNested(countryId=self._current_country_id,countryName=f"country_{self._current_country_id}",regionId=self._current_region_id)

    def make_location(self)->Location:
        location = Location()
        location.location_id = self._current_location_id
        location.city = f"city_{self._current_location_id}"
        location.postal_code = f"postal_code_{self._current_location_id}"
        location.state_province = f"state_province_{self._current_location_id}"
        location.street_address = f"st_{self._current_location_id}"
        location.country = None
        location.country_id = self._current_country_id
        location.departments=[]
        return location
    
    def make_location_create(self)->LocationCreate:
        return LocationCreate(
                city = f"city_{self._current_location_id}",
            postalCode = f"postal_code_{self._current_location_id}",
            stateProvince= f"state_province_{self._current_location_id}",
            streetAddress= f"st_{self._current_location_id}",
            countryId= self._current_country_id if self._current_country_id > 0 else 1,
            )
    
    def make_location_update(self)->LocationUpdate:
        return LocationUpdate(
            city = f"city_{self._current_location_id}",
            postalCode = f"postal_code_{self._current_location_id}",
            stateProvince= f"state_province_{self._current_location_id}",
            streetAddress= f"st_{self._current_location_id}",
            countryId= self._current_country_id if self._current_country_id > 0 else 1,
            locationId=self._current_location_id if self._current_location_id >0 else 1
            )
        
    
    def make_location_dto(self)->LocationDTO:
        country = self.make_country_nested()
        location = LocationDTO(
            city = f"city_{self._current_location_id}",
            postalCode = f"postal_code_{self._current_location_id}",
            stateProvince= f"state_province_{self._current_location_id}",
            streetAddress= f"st_{self._current_location_id}",
            countryId= self._current_country_id,
            country=country,
            departments=[],
            locationId=self._current_location_id)
        return location
        

    
    def make_location_nested(self)->LocationNested:
        return LocationNested(
            city=f"city_{self._current_location_id}",
            countryId= self._current_country_id,
            locationId=self._current_location_id,
            postalCode = f"postal_code_{self._current_location_id}",
            stateProvince= f"state_province_{self._current_location_id}",
            streetAddress= f"st_{self._current_location_id}")
        
    def make_department(self)->Department:
        self._current_department_id+=1
        department = Department()
        department.department_id = self._current_department_id
        department.department_name = f'name_{self._current_department_id}'
        department.employees = []
        department.job_histories = []
        department.location = None
        department.location_id = self._current_location_id
        return department
    
    def make_department_dto(self)->DepartmentDTO:
        location = self.make_location_nested()
        return DepartmentDTO(
            departmentId=self._current_department_id,
            departmentName=f'name_{self._current_department_id}',
            employees=[],
            jobHistories=[],
            location=location,
            locationId= location.location_id)
    
    def make_department_create(self)->DepartmentCreate:
        return DepartmentCreate(
            departmentName= f'name_{self._current_department_id}',
            locationId=self._current_location_id)
        
    def make_department_update(self)->DepartmentUpdate:
        return DepartmentUpdate(
            departmentId=self._current_department_id,
            departmentName=f'name_{self._current_department_id}',
            locationId=self._current_location_id)
    
    def make_department_nested(self)->DepartmentNested:
        return DepartmentNested(
            departmentId=self._current_department_id,
            departmentName=f'name_{self._current_department_id}',
            locationId=self._current_location_id)
            
