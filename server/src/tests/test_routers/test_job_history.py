from datetime import datetime, timedelta
import typing
from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock, AsyncMock
from fastapi import HTTPException
from services.unit_of_work import UnitOfWork
from mappers.job_history_mapper import JobHistoryMapper
from services.redis_cache import RedisCacheService
from services.job_histories import JobHistoryAsyncService
from DTOs.job_histories import JobHistoryDTO,JobHistoryCreate,JobHistoryUpdate
from services.employees import EmployeeAsyncService
from models import Job,Employee,Department,JobHistory
from services.departments import DeparmentAsyncService
from tests.factory import Factory
from routers import job_histories as job_history_router

def mock(typ: typing.Type):
    return typing.cast(typ | Mock, Mock(spec=typ))

class PointException(Exception):
    ...

class JobHistoryRouterTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.uow = mock(UnitOfWork)
        self.uow.job_history = mock(JobHistoryAsyncService)
        self.uow.employees = mock(EmployeeAsyncService)
        self.uow.jobs = mock(JobHistoryAsyncService)
        self.uow.departments = mock(DeparmentAsyncService)
        self.mapper = mock(JobHistoryMapper)
        self.cached = mock(RedisCacheService)
    
    def tearDown(self) -> None:
        ...
    
    async def test_get_all_should_when_cache_has_value_should_not_access_db_nor_set_cache(self):
        '''
        '''
        l=3
        cache_result =  [mock(JobHistory) for _ in range(l)]
        dtos = [mock(JobHistoryDTO) for _ in range(l)]

        self.cached.get_job_history = AsyncMock(return_value=cache_result)
        self.uow.job_history.get_all_async = AsyncMock()
        self.cached.set_job_history = AsyncMock()
        self.mapper.from_model_to_dto = Mock(side_effect=dtos)
         

        result = await job_history_router.get_all(query={},uow=self.uow,job_history_mapper=self.mapper,cache=self.cached)
        self.cached.get_job_history.assert_awaited_once()
        self.uow.job_history.get_all_async.assert_not_called()
        self.cached.set_job_history.assert_not_called()
        self.assertListEqual(dtos,result)
    
    async def test_get_all_when_no_cache_should_access_db_and_set_cache(self):
        '''
        '''
        l=3
        models = [mock(JobHistory) for _ in range(l)]
        dtos = [mock(JobHistoryDTO) for _ in range(l)]

        self.cached.get_job_history = AsyncMock(return_value=None)
        self.uow.job_history.get_all_async = AsyncMock(return_value=models)
        self.cached.set_job_history = AsyncMock()
        self.mapper.from_model_to_dto = Mock(side_effect=dtos)

        result = await job_history_router.get_all(query={},job_history_mapper=self.mapper,uow=self.uow,cache=self.cached)

        self.cached.get_job_history.assert_awaited_once()
        self.uow.job_history.get_all_async.assert_awaited_once()
        self.cached.set_job_history.assert_awaited_once_with(models)
        self.assertListEqual(dtos,result)
    
    async def test_get_last__not_found_should_raise_HTTPException(self):
        '''
        '''
        employee_id = mock(int)
        empty = []
        self.uow.job_history.get_all_async = AsyncMock(return_value=empty)

        with self.assertRaises(HTTPException) as ex:
            await job_history_router.get_last(employee_id=employee_id,uow=self.uow,job_history_mapper=self.mapper)
        
        self.assertEqual(ex.exception.status_code,404)
        self.uow.job_history.get_all_async.assert_awaited_once_with(employee_id,limit=1)

    
    async def test_get_last_found_should_return_dto(self):
        '''
        '''
        employee_id = mock(int)
        models = [mock(JobHistory)]
        dto = mock(JobHistoryDTO)
        self.uow.job_history.get_all_async = AsyncMock(return_value=models)
        self.mapper.from_model_to_dto = Mock(return_value=dto)
        result = await job_history_router.get_last(employee_id=employee_id,uow=self.uow,job_history_mapper=self.mapper)
        self.mapper.from_model_to_dto.assert_called_once_with(models[0])
        self.assertEqual(result,dto)
    
    async def test_create_one_employee_not_found_should_raise_HTTPException(self):
        '''
        '''
        create_dto = mock(JobHistoryCreate)
        create_dto.employee_id = mock(int)
        self.uow.employees.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await job_history_router.create_one(create_dto=create_dto,job_history_mapper=self.mapper,uow=self.uow)
        self.assertEqual(ex.exception.status_code,400)
    
    async def test_create_one_job_history_when_job_not_found_should_raise_HTTPException(self):
        '''
        '''
        create_dto = mock(JobHistoryCreate)
        create_dto.employee_id = mock(int)
        create_dto.job_id = mock(int)
        employee = mock(Employee)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await job_history_router.create_one(create_dto=create_dto,job_history_mapper=self.mapper,uow=self.uow)
        self.assertEqual(ex.exception.status_code,400)
    
    async def test_create_one_job_history_when_department_not_found_should_raise_HTTPException(self):
        '''
        '''
        create_dto = mock(JobHistoryCreate)
        create_dto.employee_id = mock(int)
        create_dto.job_id = mock(int)
        create_dto.department_id = mock(int)
        employee = mock(Employee)
        job = mock(Job)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=job)
        self.uow.departments.get_one_async = AsyncMock(return_value=None)
        with self.assertRaises(HTTPException) as ex:
            await job_history_router.create_one(create_dto=create_dto,job_history_mapper=self.mapper,uow=self.uow)
        self.assertEqual(ex.exception.status_code,400)

    async def test_create_one_job_history_when_previous_history_start_date_bigger_than_new_raise_HTTPException_(self):
        '''
        '''
        create_dto = JobHistoryCreate(employeeId=1,startDate=datetime.utcnow(),salary=5,jobId=5,departmentId=5)
        employee = Employee()
        job = mock(Job)
        department = mock(Department)
        previous_job_history = JobHistory()
        # previous job_history start_date > new
        previous_job_history.start_date = create_dto.start_date + timedelta(minutes=5)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=job)
        self.uow.departments.get_one_async = AsyncMock(return_value=department)
        self.uow.job_history.get_all_async = AsyncMock(return_value= [previous_job_history])

        with self.assertRaises(HTTPException) as ex:
            await job_history_router.create_one(create_dto=create_dto,uow=self.uow,job_history_mapper=self.mapper)
        self.assertEqual(ex.exception.status_code,400)
    

    async def test_create_one_job_history_when_previous_history_start_date_smaller_than_new_should_update_the_previous(self):
        '''
        '''
        create_dto = JobHistoryCreate(employeeId=1,startDate=datetime.utcnow(),salary=5,jobId=5,departmentId=5)
        employee = Employee()
        job = mock(Job)
        department = mock(Department)
        previous_job_history = JobHistory()
        # previous job_history start_date SMALLER new
        previous_job_history.start_date = create_dto.start_date - timedelta(minutes=5)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=job)
        self.uow.departments.get_one_async = AsyncMock(return_value=department)
        self.uow.job_history.get_all_async = AsyncMock(return_value= [previous_job_history])
        self.uow.job_history.update_one_async = AsyncMock()
        
        try:
            await job_history_router.create_one(create_dto=create_dto,uow=self.uow,job_history_mapper=self.mapper)
        finally:
            self.uow.job_history.update_one_async.assert_awaited_once_with(previous_job_history)
            self.assertEqual(previous_job_history.end_date,create_dto.start_date)

    async def test_create_one_job_history_when_no_previous_history_should_update_employee_and_save_job_history(self):
        '''
        '''
        create_dto = JobHistoryCreate(employeeId=1,startDate=datetime.utcnow(),salary=5,jobId=5,departmentId=5)
        employee = Employee()
        job = mock(Job)
        department = mock(Department)
        model = mock(JobHistory)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=job)
        self.uow.departments.get_one_async = AsyncMock(return_value=department)
        self.uow.job_history.get_all_async = AsyncMock(return_value= [])

        self.uow.job_history.create_one_async = AsyncMock()
        self.uow.employees.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock(side_effect=PointException())
        self.mapper.from_create_to_model = Mock(return_value=model)

        try:
            await job_history_router.create_one(create_dto=create_dto,job_history_mapper=self.mapper,uow=self.uow)
        except PointException:
            self.uow.job_history.get_all_async.assert_awaited_once_with(employee_id=create_dto.employee_id,limit=1)
            self.mapper.from_create_to_model.assert_called_once_with(create_dto)
            self.uow.job_history.create_one_async.assert_awaited_once_with(model)
            self.uow.employees.update_one_async.assert_awaited_once_with(employee)
    
    
    async def test_create_one_job_history_should_return_dto(self):
        '''
        '''
        create_dto = JobHistoryCreate(employeeId=1,startDate=datetime.utcnow(),salary=5,jobId=5,departmentId=5)
        employee = Employee()
        job = mock(Job)
        department = mock(Department)
        model = mock(JobHistory)
        dto = mock(JobHistoryDTO)
        self.uow.employees.get_one_async = AsyncMock(return_value=employee)
        self.uow.jobs.get_one_async = AsyncMock(return_value=job)
        self.uow.departments.get_one_async = AsyncMock(return_value=department)
        self.uow.job_history.get_all_async = AsyncMock(return_value= [])

        self.uow.job_history.create_one_async = AsyncMock()
        self.uow.employees.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        self.mapper.from_create_to_model = Mock(return_value=model)
        self.mapper.from_model_to_dto = Mock(return_value=dto)

        result = await job_history_router.create_one(create_dto=create_dto,job_history_mapper=self.mapper,uow=self.uow)

        self.assertEqual(result,dto)
    
    async def test_update_one_when_not_found_should_raise_HTTPException(self):
        '''
        '''
        update_dto = JobHistoryUpdate(employeeId=1,startDate=datetime.utcnow(),endDate=None)
        self.uow.job_history.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await job_history_router.update_one(update_dto=update_dto,uow=self.uow,job_history_mapper=self.mapper) 
        
        self.assertEqual(ex.exception.status_code,404)
        self.uow.job_history.get_one_async.assert_awaited_once_with(update_dto.employee_id,update_dto.start_date)
    
    async def test_update_one_job_history_when_valid_should_call_update_before_commit(self):
        '''
        '''
        update_dto = JobHistoryUpdate(employeeId=1,startDate=datetime.utcnow(),endDate=None)
        model = JobHistory()
        new_model = JobHistory()
        dto = mock(JobHistoryDTO)
        self.uow.job_history.get_one_async = AsyncMock(return_value=model)
        self.mapper.from_update_to_model = Mock(return_value=new_model)
        self.uow.job_history.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock(side_effect=PointException())
        self.mapper.from_model_to_dto= Mock(return_value=dto)

        try:
            await job_history_router.update_one(update_dto=update_dto,job_history_mapper=self.mapper,uow=self.uow)
        except PointException:
            self.mapper.from_update_to_model.assert_called_once_with(update_dto,model)
            self.uow.job_history.update_one_async.assert_awaited_once_with(new_model)
            self.uow.commit_async.assert_awaited_once()
    
    async def test_update_one_job_history_should_return_dto(self):
        '''
        '''
        update_dto = JobHistoryUpdate(employeeId=1,startDate=datetime.utcnow(),endDate=None)
        model = JobHistory()
        new_model = JobHistory()
        dto = mock(JobHistoryDTO)
        self.uow.job_history.get_one_async = AsyncMock(return_value=model)
        self.mapper.from_update_to_model = Mock(return_value=new_model)
        self.uow.job_history.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        self.mapper.from_model_to_dto= Mock(return_value=dto)

        result = await job_history_router.update_one(update_dto=update_dto,job_history_mapper=self.mapper,uow=self.uow)

        self.assertEqual(result,dto)
    
    async def test_delete_one_job_history_should_succeed(self):
        '''
        '''
        _id = mock(int)
        start_date = mock(datetime)
        self.uow.job_history.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock(side_effect=PointException())
        
        try:
            await job_history_router.delete_one(employee_id=_id,start_date=start_date,uow=self.uow)
        except PointException:
            self.uow.job_history.delete_one_async.assert_awaited_once_with(_id,start_date)
            self.uow.commit_async.assert_awaited_once()






        
        



    
