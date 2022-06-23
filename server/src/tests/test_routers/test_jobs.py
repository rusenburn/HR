from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import MagicMock, Mock, AsyncMock,PropertyMock
from fastapi import HTTPException
from services.unit_of_work import UnitOfWork
from services.redis_cache import RedisCacheService
from models import Job
from DTOs.nested import JobNested
from DTOs.jobs import JobDTO,JobCreate,JobUpdate
from tests.factory import Factory
from routers import jobs as jobs_router
from mappers.job_mapper import JobMapper
import typing

class JobsRouterTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.factory = Factory()
        self.uow : Mock | UnitOfWork = AsyncMock()
        self.cache : Mock | RedisCacheService = AsyncMock()
        self.mapper : Mock | JobMapper = Mock()
    
    def tearDown(self) -> None:
        ...
    
    async def test_get_all_when_cache_should_not_access_db_or_set_cache(self):
        '''
        Objective: get all jobs
        Condition: cache returns value
        Expected : should not access jobs service nor set a cache
        '''
        l = 3
        cache_result = [Mock(spec=Job) for _ in range(l)]
        self.cache.get_jobs = AsyncMock(return_value=cache_result)
        self.uow.jobs.get_all_async = AsyncMock()
        self.cache.set_countries = AsyncMock()
        self.mapper.from_model_to_nested = Mock(side_effect=lambda x : Mock(spec=JobNested))
        
        result= await jobs_router.get_all(uow=self.uow,job_mapper=self.mapper,cached=self.cache,query={})
        
        self.assertEqual(len(result),l)

        for item in result:
            self.assertIsInstance(item,JobNested)

        self.cache.get_jobs.assert_awaited_once()
        self.uow.jobs.get_all_async.assert_not_called()
        self.cache.set_countries.assert_not_called()
        for item in cache_result:
            self.mapper.from_model_to_nested.assert_any_call(item)
    
    async def test_get_all_when_no_cache_should_check_service_and_set_cache(self):
        '''
        Objective: get all jobs
        Condition: cache returns None 
        Expected : should access jobs service and set a cache
        '''

        l=3
        service_result = [Mock(spec=Job) for _ in range(l)]
        self.cache.get_jobs = AsyncMock(return_value=None)
        self.uow.jobs.get_all_async = AsyncMock(return_value=service_result)
        self.cache.set_jobs = AsyncMock()
        self.mapper.from_model_to_nested = Mock(side_effect=lambda x: Mock(JobNested))
        result = await jobs_router.get_all(uow=self.uow,job_mapper=self.mapper,cached=self.cache,query={})

        self.assertEqual(len(result),3)
        self.uow.jobs.get_all_async.assert_awaited_once()
        self.cache.get_jobs.assert_awaited_once()
        self.cache.set_jobs.assert_called_once_with(service_result)
        self.assertEqual(len(result),l)
        for item in service_result:
            self.mapper.from_model_to_nested.assert_any_call(item)
        for item in result:
            self.assertIsInstance(item,JobNested)
    
    async def test_get_one_not_found_should_raise_HTTPException(self):
        '''
        Objective: get a job 
        Condition: service return None (does not exist)
        Expected : raise HTTPException 404 not found
        '''
        job_id = Mock(spec=int)
        self.uow.jobs.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await jobs_router.get_one(job_id=job_id,uow=self.uow,job_mapper=self.mapper)
        
        self.assertEqual(ex.exception.status_code,404)
        self.uow.jobs.get_one_async.assert_called_once_with(job_id)
    
    async def test_get_one_found_return_dto(self):
        '''
        Objective: get a job
        Condition: service return a job
        Expected : map job to dto and return the dto
        '''

        job_id = Mock(spec=int)
        service_result =  Mock(Job)
        dto = Mock()
        self.uow.jobs.get_one_async = AsyncMock(return_value=service_result)
        self.mapper.from_model_to_dto = Mock(return_value = dto)

        result = await jobs_router.get_one(uow=self.uow,job_id=job_id,job_mapper=self.mapper)

        self.assertEqual(result,dto)
        self.uow.jobs.get_one_async.assert_awaited_once_with(job_id)
        self.mapper.from_model_to_dto.assert_called_once_with(service_result)

    async def test_create_one_with_existed_title(self):
        '''
        Objective: create a job
        Condition: True that title exist
        Expected : raise HTTPException 400 bad request
        '''

        job_create = typing.cast(JobCreate|Mock,Mock(JobCreate))
        job_create.job_title = PropertyMock(str)
        self.uow.jobs.title_exist_async = AsyncMock(return_value=True)

        with self.assertRaises(HTTPException) as ex:
            await jobs_router.create_one(job_create=job_create,job_mapper=self.mapper,uow=self.uow)
        
        self.assertEqual(ex.exception.status_code , 400)
        self.uow.jobs.title_exist_async.assert_awaited_once_with(job_create.job_title)

    async def test_create_one_with_valid_inputs_should_create_and_commit_and_return_dto(self):
        '''
        Objective: create a job
        Condition: inputs are valid
        Expected : create , commit , return nested dto
        '''

        job_create = typing.cast(JobCreate|Mock,Mock(JobCreate))
        job_create.job_title = PropertyMock(str)
        model = typing.cast(Job , Mock(spec=Job))
        nested = typing.cast(JobNested,Mock(spec=JobNested))
        self.uow.jobs.title_exist_async = AsyncMock(return_value=False)
        self.uow.jobs.create_one_async = AsyncMock()
        self.mapper.from_create_to_model = Mock(return_value=model)
        self.mapper.from_model_to_nested = Mock(return_value= nested)
        self.uow.commit_async = AsyncMock()
        result = await jobs_router.create_one(job_create=job_create,job_mapper=self.mapper,uow=self.uow)

        self.assertEqual(result , nested)
        self.uow.jobs.title_exist_async.assert_awaited_once_with(job_create.job_title)
        self.mapper.from_create_to_model.assert_called_once_with(job_create)
        self.uow.jobs.create_one_async.assert_called_once_with(model)
        self.uow.commit_async.assert_awaited_once()
        self.mapper.from_model_to_nested.assert_called_once_with(model)
    
    async def test_update_one_not_found_should_raise_HTTPExpcetion(self):
        '''
        Objective: update a job
        Condition: service returns None (does not exist)
        Expected : raise HTTPEXception 404
        '''

        update_dto = typing.cast(JobUpdate,Mock(JobUpdate))
        update_dto.job_id = Mock(int)
        self.uow.jobs.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await jobs_router.update_one(job_update=update_dto,uow=self.uow,job_mapper=self.mapper)
        
        self.assertEqual(ex.exception.status_code, 404)
        self.uow.jobs.get_one_async.assert_awaited_once_with(update_dto.job_id)

    async def test_update_one_job_title_but_new_exists_beside_the_model_should_raise_HTTPException(self):
        '''
        Objective: update a job
        Condition: job found , job title changed , but new title exist in db 
        Expected : raise HTTPEXception 400 Bad request
        '''
        update_dto = typing.cast(JobUpdate,Mock(JobUpdate))
        update_dto.job_id = Mock(int)
        model = typing.cast(Job,Mock(Job))

        # model.job_title = "title_1"
        model.job_title = Mock(wraps="title_1")
        # update_dto.job_title = "title_2"
        update_dto.job_title = Mock(wraps="title_2")

        self.uow.jobs.get_one_async = AsyncMock(return_value=model)
        self.uow.jobs.title_exist_async = AsyncMock(return_value=True)

        with self.assertRaises(HTTPException)  as ex:
            await jobs_router.update_one(job_update=update_dto,uow=self.uow,job_mapper=self.mapper)
        
        self.assertEqual(ex.exception.status_code , 400)
    
    async def test_update_job_title_should_check_if_title_exists_in_db(self):
        '''
        Objective: update a job
        Condition: job found , job title changed 
        Expected : should check if title exist in db
        '''

        update_dto = typing.cast(JobUpdate,Mock(JobUpdate))
        update_dto.job_id = Mock(int)
        update_dto.job_title = Mock(wraps="title_1")
        model = typing.cast(Job,Mock(Job))
        model.job_title = Mock(wraps="TITLE_2")
        self.uow.jobs.get_one_async = AsyncMock(return_value=model)
        self.uow.jobs.title_exist_async = AsyncMock(return_value=False)

        await jobs_router.update_one(job_update=update_dto,uow=self.uow,job_mapper=self.mapper)
        self.uow.jobs.title_exist_async.assert_called_once_with(update_dto.job_title)
    
    async def test_update_job_valid_inputs_should_save_and_commit(self):
        '''
        Objective: update a job
        Condition: all inputs are good
        Expected : should update the old model , and commit
        '''

        update_dto = typing.cast(JobUpdate,Mock(JobUpdate))
        update_dto.job_id = Mock()
        update_dto.job_title = Mock(wraps="title_1")
        model = typing.cast(Job,Mock(Job))
        model.job_title = Mock(wraps="TITLE_1")
        updated_model = typing.cast(Job,Mock(Job))
        nested = typing.cast(JobNested,Mock(JobNested))

        self.uow.jobs.get_one_async = AsyncMock(return_value=model)
        self.uow.jobs.title_exist_async = AsyncMock()

        self.mapper.from_update_to_model = Mock(return_value=updated_model)
        self.uow.jobs.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        self.mapper.from_model_to_nested = Mock(return_value=nested)

        result = await jobs_router.update_one(job_update=update_dto,uow=self.uow,job_mapper=self.mapper)

        self.assertEqual(result,nested)
        self.mapper.from_update_to_model.assert_called_once_with(update_dto,model)
        self.uow.jobs.update_one_async.assert_awaited_once_with(updated_model)
        self.uow.commit_async.assert_awaited_once()
    
    async def test_delete_one_job_should_delete_and_commit(self):
        '''
        Objective: delete a job
        Condition: Any
        Expected : should delete and commit
        '''
        job_id = Mock(int)
        self.uow.jobs.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        await jobs_router.delete_one(job_id=job_id,uow=self.uow)

        self.uow.jobs.delete_one_async.assert_awaited_once_with(job_id)
        self.uow.commit_async.assert_awaited_once()








