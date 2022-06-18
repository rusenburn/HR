from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock, AsyncMock
from fastapi import HTTPException
from services.unit_of_work import UnitOfWork0
from mappers.department_mapper import DepartmentMapper
from services.redis_cache import RedisCacheService
from DTOs.departments.department_update_dto import DepartmentUpdate
from models.departments import Department
from tests.factory import Factory
from routers import departments as department_router


class DepartmentRouterTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.factory = Factory()
        self.uow : Mock|UnitOfWork0 = Mock()
        self.department_mapper : Mock|DepartmentMapper = Mock()
        self.cache : Mock|RedisCacheService = Mock()
    
    def tearDown(self) -> None:
        ...
    
    async def test_get_one_department_not_found(self):
        '''
        Objective: Getting one department
        Condition: department does not exist
        Expected Behaviour: raise HTTPException 404
        '''
        department_id = 1
        self.uow.departments.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await department_router.get_one(department_id=department_id,uow=self.uow,department_mapper=self.department_mapper)
        
        self.assertEqual(ex.exception.status_code, 404)
        self.uow.departments.get_one_async.assert_awaited_once_with(department_id)

    async def test_get_one_department_should_succeed(self):
        '''
        Objective: Getting one department
        Condition: inputs are valid
        Expected Behaviour: map from model to dto and return dto
        '''

        department_id = 1
        service_result = self.factory.make_department()
        mapper_result  =self.factory.make_department_nested()
        self.uow.departments.get_one_async = AsyncMock(return_value=service_result)
        self.department_mapper.from_model_to_dto =Mock(return_value=mapper_result)

        result= await department_router.get_one(department_id=department_id,department_mapper=self.department_mapper,uow=self.uow)

        self.assertEqual(mapper_result,result)
        self.uow.departments.get_one_async.assert_awaited_once_with(department_id)
        self.department_mapper.from_model_to_dto.assert_called_once_with(service_result)

    async def test_get_all_cached_should_not_access_db(self):
        '''
        Objective: Getting all departments
        Condition: cache has the value
        Expected Behaviour: should not access db service or set cache
        '''
        l=3
        cache_result = [self.factory.make_department() for _ in range(l)]
        self.cache.get_departments = AsyncMock(return_value=cache_result)
        self.cache.set_departments = AsyncMock()
        self.uow.departments.get_all_async = AsyncMock()
        self.department_mapper = Mock(side_effect=lambda x : self.factory.make_department_nested())

        result = await department_router.get_all({},department_mapper=self.department_mapper,uow=self.uow,cached=self.cache)

        self.assertEqual(len(result),l)
        self.cache.get_departments.assert_awaited_once()
        self.cache.set_departments.assert_not_called()
        self.uow.departments.get_all_async.assert_not_called()
        # self.department_mapper.assert_has_calls(cache_result)
    
    async def test_get_all_no_cache_should_check_db_service_and_set_cache(self):
        '''
        Objective: Getting all departments
        Condition: no cache
        Expected Behaviour: should access db service and set cache
        '''
        
        l=3
        service_result = [self.factory.make_department() for _ in range(l)]
        self.cache.get_departments = AsyncMock(return_value=None)
        self.uow.departments.get_all_async = AsyncMock(return_value=service_result)
        self.cache.set_departments = AsyncMock()
        self.department_mapper = Mock(side_effect=lambda x : self.factory.make_department_nested())

        result = await department_router.get_all({},department_mapper=self.department_mapper,uow=self.uow,cached=self.cache)

        self.cache.get_departments.assert_awaited_once()
        self.uow.departments.get_all_async.assert_awaited_once()
        self.cache.set_departments.assert_awaited_once_with(service_result)
        # self.department_mapper.assert_has_calls(service_result)
        self.assertEqual(len(result),l)
    
    async def test_create_one_with_invalid_location(self):
        '''
        Objective: Create a department
        Condition: invalid location_id (does not exist)
        Expected Behaviour: raise HTTPException 400 bad request
        '''
        
        create_dto = self.factory.make_department_create()
        self.uow.locations.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await department_router.create_one(department_create=create_dto,department_mapper=self.department_mapper,uow=self.uow)
        
        self.assertEqual(ex.exception.status_code,400)
        self.uow.locations.get_one_async.assert_called_once_with(create_dto.location_id)

    
    async def test_create_one_should_succeed(self):
        '''
        Objective: Create a department
        Condition: valid inputs
        Expected Behaviour: create and commit , return nested dto
        '''
        create_dto = self.factory.make_department_create()
        locations_result = self.factory.make_location()
        to_model_result = self.factory.make_department()
        to_nested_result = self.factory.make_department_nested()

        self.uow.locations.get_one_async =AsyncMock(return_value=locations_result)
        self.department_mapper.from_create_to_model = Mock(return_value=to_model_result)
        self.uow.commit_async = AsyncMock()
        self.uow.departments.create_one_async = AsyncMock()
        self.department_mapper.from_model_to_nested = Mock(return_value=to_nested_result)

        result = await department_router.create_one(department_create=create_dto,department_mapper=self.department_mapper,uow=self.uow)

        self.assertEqual(result,to_nested_result)
        self.uow.locations.get_one_async.assert_awaited_once_with(create_dto.location_id)
        self.department_mapper.from_create_to_model.assert_called_once_with(create_dto)
        self.uow.departments.create_one_async.assert_awaited_once_with(to_model_result)
        self.department_mapper.from_model_to_nested.assert_called_once_with(to_model_result)
    
    async def test_update_one_not_found_should_raise_HTTPException(self):
        '''
        Objective: Update a department
        Condition: department does not exist
        Expected Behaviour: raise HTTPEXception 404
        '''

        update_dto = self.factory.make_department_update()
        self.uow.departments.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await department_router.update_one(department_update=update_dto,department_mapper=self.department_mapper,uow=self.uow)
        
        self.assertEqual(ex.exception.status_code,404)
        
        self.uow.departments.get_one_async.assert_awaited_once_with(update_dto.department_id)

    async def test_update_one_invalid_location(self):
        '''
        Objective: Update a department
        Condition: request has invalid location_id
        Expected Behaviour: HTTPEXception 400 bad request
        '''

        update_dto = self.factory.make_department_update()
        departments_result = self.factory.make_department()

        self.uow.departments.get_one_async = AsyncMock(return_value=departments_result)
        self.uow.locations.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await department_router.update_one(department_update=update_dto,department_mapper=self.department_mapper,uow=self.uow)
        
        self.assertEqual(ex.exception.status_code,400)
        self.uow.locations.get_one_async.assert_awaited_once_with(update_dto.location_id)
    
    async def test_update_one_should_succeed(self):
        '''
        Objective: Update a department
        Condition: valid inputs
        Expected Behaviour: update ,commit , return nested dto
        '''
        update_dto = self.factory.make_department_update()
        departments_result = self.factory.make_department()
        locations_result = self.factory.make_location()
        to_model = self.factory.make_department()
        to_nested = self.factory.make_department_nested()

        self.uow.departments.get_one_async = AsyncMock(return_value=departments_result)
        self.uow.locations.get_one_async = AsyncMock(return_value=locations_result)
        self.department_mapper.from_update_to_model = Mock(return_value=to_model)
        self.department_mapper.from_model_to_nested = Mock(return_value=to_nested)

        self.uow.departments.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        result = await department_router.update_one(department_update=update_dto,department_mapper=self.department_mapper,uow=self.uow)

        self.uow.departments.get_one_async.assert_awaited_once_with(update_dto.department_id)
        self.uow.locations.get_one_async.assert_awaited_once_with(update_dto.location_id)
        self.department_mapper.from_update_to_model.assert_called_once_with(update_dto,departments_result)
        self.uow.departments.update_one_async.assert_awaited_once_with(to_model)
        self.uow.commit_async.assert_awaited_once()
        self.department_mapper.from_model_to_nested.assert_called_once_with(to_model)
        self.assertEqual(result,to_nested)
    
    async def test_delete_one_not_found_should_raise_HTTPException(self):
        '''
        Objective: delete a department
        Condition: department does not exist
        Expected Behaviour: raise HTTPException 404
        '''

        department_id = Mock(spec=int)
        self.uow.departments.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await department_router.delete_one(department_id,uow=self.uow)
        self.assertEqual(ex.exception.status_code, 404)
        self.uow.departments.get_one_async.assert_awaited_once_with(department_id)
    
    async def test_delete_one_should_succeed(self):
        '''
        Objective: delete a department
        Condition: inputs are valid
        Expected Behaviour: delete and commit
        '''
        department_id = Mock(spec=int)
        department_result = Mock(spec=Department)
        self.uow.departments.get_one_async = AsyncMock(return_value=department_result)
        self.uow.commit_async = AsyncMock()
        self.uow.departments.delete_one_async = AsyncMock()

        await department_router.delete_one(department_id=department_id,uow=self.uow)

        self.uow.departments.delete_one_async.assert_awaited_once_with(department_id)
        self.uow.commit_async.assert_awaited_once()
        



