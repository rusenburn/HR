from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock, AsyncMock
from fastapi.testclient import TestClient
from fastapi import HTTPException
from services.unit_of_work import UnitOfWork0
from services.redis_cache import RedisCacheService
from mappers.location_mapper import LocationMapper
from tests.factory import Factory
from routers import locations as LocationRouter


class LocationsRouterTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.factory = Factory()
        self.uow: Mock | UnitOfWork0 = Mock()
        self.location_mapper : Mock | LocationMapper = Mock()
        self.cache : RedisCacheService|Mock = Mock()

    def tearDown(self) -> None:
        ...

    async def test_get_all_when_cache_should_not_call_db_service(self):
        '''
        Objective: Get All Location
        Condition: Cache has location values
        Expected-Behaviour: Should not call location service and should not set cache
        '''
        i = 3
        cache_result = [self.factory.make_location() for _ in range(i)]
        self.cache.get_locations = AsyncMock(return_value=cache_result)
        self.uow.locations.get_all_async = AsyncMock()
        self.cache.set_locations = AsyncMock()
        self.location_mapper.from_model_to_nested = Mock(return_value=self.factory.make_country_nested())
        query = {}
        result = await LocationRouter.get_all(query=query,uow=self.uow,location_mapper=self.location_mapper,cached=self.cache)

        self.cache.get_locations.assert_awaited_once()
        self.uow.locations.get_all_async.assert_not_called()
        self.cache.set_locations.assert_not_called()
        self.assertEqual(len(result),i)

    async def test_get_all_when_no_cache(self):
        '''
        Objective: Get All Location
        Condition: Cache has location values
        Expected-Behaviour: Should not call location service and should not set cache
        '''
        i=3
        cache_result = None
        service_result = [self.factory.make_location() for _ in range(i)]

        self.cache.get_locations = AsyncMock(return_value=cache_result)
        self.uow.locations.get_all_async = AsyncMock(return_value=service_result)
        self.cache.set_locations = AsyncMock()
        self.location_mapper.from_model_to_nested = Mock(return_value=self.factory.make_country_nested())

        result = await LocationRouter.get_all(query={},uow=self.uow,location_mapper=self.location_mapper,cached=self.cache)

        self.cache.get_locations.assert_awaited_once()
        self.uow.locations.get_all_async.assert_awaited_once()
        self.cache.set_locations.assert_awaited_once_with(service_result)
        # self.location_mapper.from_model_to_nested.assert_has_calls(service_result)
        self.assertEqual(len(result),i)
    
    async def test_get_one_location_not_found_should_raise_HTTPException(self):
        '''
        Objective: Get One Location
        Condition: Location Does not exist
        Expected : Raise HTTPException 404 not found
        '''
        
        location_id = 1
        self.uow.locations.get_one_async = AsyncMock(return_value= None)
        with self.assertRaises(HTTPException) as ex:
            await LocationRouter.get_one(location_id=location_id,uow=self.uow,location_mapper=self.location_mapper)
        
        self.assertEqual(ex.exception.status_code,404)
        self.uow.locations.get_one_async.assert_called_once_with(location_id)
    
    async def test_get_one_location_should_return_dto(self):
        '''
        Objective: Get One Location
        Condition: Location Exist
        Expected : map model to dto and return the dto
        '''

        location_id = 1
        service_result = self.factory.make_location()
        mapper_result = self.factory.make_location_dto()
        self.uow.locations.get_one_async = AsyncMock(return_value=service_result)
        self.location_mapper.from_model_to_dto = Mock(return_value=mapper_result)

        result = await LocationRouter.get_one(location_id=location_id,uow=self.uow,location_mapper=self.location_mapper)

        self.assertEqual(mapper_result,result)
        self.uow.locations.get_one_async.assert_awaited_once_with(location_id)
        self.location_mapper.from_model_to_dto.assert_called_once_with(service_result)
    
    async def test_create_one_location_with_invalid_country_id(self):
        '''
        Objective: Create Location
        Condition: Invalid country_id was provided
        Expected : raises HTTPExpcetion 400
        '''
        create_dto = self.factory.make_location_create()
        self.uow.countries.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await LocationRouter.create_one(location_create=create_dto,uow=self.uow,location_mapper=self.location_mapper)
        
        self.assertEqual(ex.exception.status_code,400)
        self.uow.countries.get_one_async.assert_awaited_once_with(create_dto.country_id)
    
    async def test_create_one_location_should_create_and_commit(self):
        '''
        Objective: Create Location
        Condition: Providing a valid location create 
        Expected : map , create , commit , return a nested model
        '''

        create_dto = self.factory.make_location_create()
        get_country_result = self.factory.make_country()
        to_model_result = self.factory.make_location()
        to_nested_result = self.factory.make_location_nested()

        self.uow.countries.get_one_async = AsyncMock(return_value=get_country_result)
        self.location_mapper.from_create_to_model = Mock(return_value=to_model_result)
        self.location_mapper.from_model_to_nested = Mock(return_value=to_nested_result)
        self.uow.locations.create_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        result = await LocationRouter.create_one(location_create=create_dto,uow=self.uow,location_mapper=self.location_mapper)

        self.uow.countries.get_one_async.assert_awaited_once_with(create_dto.country_id)
        self.location_mapper.from_create_to_model.assert_called_once_with(create_dto) 
        self.uow.locations.create_one_async.assert_awaited_once_with(to_model_result)
        self.uow.commit_async.assert_awaited_once()
        self.location_mapper.from_model_to_nested.assert_called_once_with(to_model_result)

        self.assertEqual(result,to_nested_result)

    async def test_update_one_location_not_found(self):
        '''
        Objective: Update Location
        Condition: Providing invalid location_id (does not exist) 
        Expected : raise HTTPException 404
        '''

        update_dto = self.factory.make_location_update()
        self.uow.locations.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await LocationRouter.update_one(location_update=update_dto,uow=self.uow,location_mapper=self.location_mapper)
        
        self.uow.locations.get_one_async.assert_awaited_once_with(update_dto.location_id)
        self.assertEqual(ex.exception.status_code,404)
    
    async def test_update_one_location_invalid_country_id_should_raise_HTTPException(self):
        '''
        Objective: Update Location
        Condition: Providing invalid Country (does not exist) 
        Expected : raise HTTPException 400 Bad request
        '''
        update_dto = self.factory.make_location_update()
        location_service_result = self.factory.make_location()
        self.uow.locations.get_one_async = AsyncMock(return_value=location_service_result)
        self.uow.countries.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await LocationRouter.update_one(location_update=update_dto,uow=self.uow,location_mapper=self.location_mapper)
        
        self.uow.locations.get_one_async.assert_awaited_once_with(update_dto.location_id)
        self.uow.countries.get_one_async.assert_awaited_once_with(update_dto.country_id)
        self.assertEqual(ex.exception.status_code,400)

    async def test_update_one_location_should_update_and_commit(self):
        '''
        Objective: Update Location
        Condition: Providing valid inputs
        Expected : map , update , commit , return nested dto
        '''
        update_dto = self.factory.make_location_update()
        location_service_result = self.factory.make_location()
        country_service_result = self.factory.make_country()
        to_model_result = self.factory.make_location()
        to_nested_result = self.factory.make_location_nested()

        self.uow.locations.get_one_async = AsyncMock(return_value=location_service_result)
        self.uow.countries.get_one_async = AsyncMock(return_value=country_service_result)
        self.location_mapper.from_update_to_model = Mock(return_value=to_model_result)
        self.location_mapper.from_model_to_nested = Mock(return_value=to_nested_result)
        self.uow.commit_async = AsyncMock()
        self.uow.locations.update_one_async = AsyncMock()

        result =await LocationRouter.update_one(location_update=update_dto,uow=self.uow,location_mapper=self.location_mapper)

        self.assertEqual(result,to_nested_result)
        self.uow.locations.get_one_async.assert_awaited_once_with(update_dto.location_id)
        self.uow.countries.get_one_async.assert_awaited_once_with(update_dto.country_id)
        self.location_mapper.from_update_to_model.assert_called_once_with(update_dto,location_service_result)
        self.location_mapper.from_model_to_nested.assert_called_once_with(to_model_result)
        self.uow.commit_async.assert_awaited_once()
        self.uow.locations.update_one_async.assert_awaited_once_with(to_model_result)
    
    async def test_delete_one_location_not_found_should_raise_HTTPException(self):
        '''
        Objective: Delete location
        Condition: location does not exist
        Expected : raise HTTPException
        '''
        location_id = 1
        self.uow.locations.get_one_async = AsyncMock(return_value=None)
        
        with self.assertRaises(HTTPException) as ex:
            await LocationRouter.delete_one(location_id=location_id,uow=self.uow)

        self.assertEqual(ex.exception.status_code,404)
    
    async def test_delete_one_location_success(self):
        '''
        Objective: Delete Location
        Condition: Providing valid location_id
        Expected : delete and commit
        '''

        location_id = 1
        service_result = self.factory.make_location()
        self.uow.locations.get_one_async = AsyncMock(return_value= service_result)
        self.uow.locations.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        await LocationRouter.delete_one(location_id=location_id,uow=self.uow)

        self.uow.locations.delete_one_async.assert_awaited_once_with(location_id)
        self.uow.commit_async.assert_awaited_once()




        









