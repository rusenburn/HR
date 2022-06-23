from contextlib import AsyncContextDecorator
from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock, AsyncMock

from fastapi import HTTPException
from DTOs.nested import CountryNested
from tests.factory import Factory
from services.unit_of_work import UnitOfWork
from services.redis_cache import RedisCacheService
from mappers.country_mapper import CountryMapper
from routers.countries import get_one, get_all, create_one, update_one, delete_one


class TestCountriesRouter(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.factory = Factory()
        
        self.uow: Mock | UnitOfWork = Mock(UnitOfWork)
        self.uow.countries = Mock()
        self.uow.regions = Mock()
        self.country_mapper: Mock | CountryMapper = Mock()
        self.cache: Mock|RedisCacheService = Mock()

    def tearDown(self) -> None:
        ...

    async def test_get_one_not_found_should_raise_HTTPExeption(self):
        '''
        Test get one non existed country should return HTTPException 404
        '''
        country_id = 1
        self.uow.countries.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await get_one(country_id=country_id, uow=self.uow,country_mapper=self.country_mapper)

        exception = ex.exception
        self.uow.countries.get_one_async.assert_awaited_once_with(country_id)
        self.assertEqual(exception.status_code ,404)
    async def test_get_one_existed_should_succeed(self):
        '''
        Test trying to get a country that exist in database should succeed
        '''
        country_id = 1
        country = self.factory.make_country()
        country_dto = self.factory.make_country_dto()
        self.uow.countries.get_one_async = AsyncMock(return_value=country)
        self.country_mapper.from_model_to_dto = Mock(return_value=country_dto)

        result = await get_one(country_id=country_id,uow=self.uow,country_mapper=self.country_mapper)

        self.assertEqual(country_dto,result)
        self.uow.countries.get_one_async.assert_awaited_once_with(country_id)
        self.country_mapper.from_model_to_dto.assert_called_once_with(country)
    
    async def test_get_all_when_cache_exist(self):
        '''
        Test When caching provide a value for countries ,
        it should not try to access database or set another cache
        '''
        countries = [self.factory.make_country() for _ in range(3)]
        self.cache.get_countries = AsyncMock(return_value=countries)
        self.uow.countries.get_all_async = AsyncMock()
        self.cache.set_countries = AsyncMock()
        self.country_mapper.from_model_to_nested = Mock(side_effect= lambda x: self.factory.make_country_nested())
        
        result = await get_all(uow=self.uow,country_mapper=self.country_mapper,cached=self.cache,query={})

        self.cache.get_countries.assert_awaited_once()
        self.uow.countries.get_all_async.assert_not_called()
        self.cache.set_countries.assert_not_called()
        # self.country_mapper.from_model_to_nested.assert_has_calls(countries)
        for item in result:
            self.assertIsInstance(item,CountryNested)
    
    async def test_get_all_when_no_cache(self):
        '''
        Test When caching DOES NOT provide a value for countries,
        it should try to access service and set caching
        '''
        countries = [self.factory.make_country() for _ in range(3)]
        self.cache.get_countries = AsyncMock(return_value=None)
        self.cache.set_countries = AsyncMock()
        self.uow.countries.get_all_async = AsyncMock(return_value=countries)
        self.country_mapper.from_model_to_nested = Mock(side_effect=lambda x : self.factory.make_country_nested())

        result = await get_all(uow=self.uow,country_mapper=self.country_mapper,cached=self.cache,query={})

        self.cache.get_countries.assert_awaited_once()
        self.uow.countries.get_all_async.assert_awaited_once()
        self.cache.set_countries.assert_awaited_once_with(countries)
        # self.country_mapper.from_model_to_nested.assert_has_calls(countries)
    
    async def test_create_one_country_with_wrong_region_id_should_raise_HTTPException(self):
        '''
        Testing creating a country with invalid region_id that does not exist in database
        should throw HTTPException 400 bad request
        '''
        create_dto = self.factory.make_country_create_dto()
        self.uow.regions.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await create_one(create_dto=create_dto,uow=self.uow,country_mapper=self.country_mapper)
        exception = ex.exception
        
        self.assertEqual(exception.status_code,400)
        self.uow.regions.get_one_async.assert_awaited_once_with(create_dto.region_id)
    
    async def test_create_one_country_with_valid_region_id(self):
        '''
        Test creating a country with valid region_id
        should invoke mapping ,creating and commiting 
        '''
        create_dto = self.factory.make_country_create_dto()
        region = self.factory.make_region()
        country = self.factory.make_country()
        nested = self.factory.make_country_nested()

        self.uow.regions.get_one_async = AsyncMock(return_value = region)
        self.uow.countries.create_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        self.country_mapper.from_create_to_model = Mock(return_value=country)
        self.country_mapper.from_model_to_nested = Mock(return_value=nested)

        result = await create_one(create_dto=create_dto,uow=self.uow,country_mapper=self.country_mapper)

        self.assertEqual(result,nested)
        self.uow.regions.get_one_async.assert_awaited_once_with(create_dto.region_id)
        self.country_mapper.from_create_to_model.assert_called_once_with(create_dto)
        self.uow.countries.create_one_async.assert_called_once_with(country)
        self.country_mapper.from_model_to_nested.assert_called_once_with(country)
        self.uow.commit_async.assert_called_once()

    async def test_update_one_country_not_found_should_raise_HTTPException(self):
        '''
        Test updating a non existed country
        should raise HTTPException 404 not found
        '''

        update_dto = self.factory.make_country_update_dto()
        self.uow.countries.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await update_one(update_dto,uow=self.uow,country_mapper=self.country_mapper)
        
        self.assertEqual(ex.exception.status_code , 404)
        self.uow.countries.get_one_async.assert_awaited_once_with(update_dto.country_id)
    
    async def test_update_one_country_with_invalid_region_id_should_raise_HTTPException(self):
        '''
        Test updating a country with invalid region_id
        should raise HTTPException 400 bad request
        '''
        update_dto = self.factory.make_country_update_dto()
        country = self.factory.make_country()
        self.uow.countries.get_one_async = AsyncMock(return_value=country)
        self.uow.regions.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await update_one(update_dto,uow=self.uow,country_mapper=self.country_mapper)
        
        self.assertEqual(ex.exception.status_code,400)
        self.uow.countries.get_one_async.assert_awaited_once_with(update_dto.country_id)
        self.uow.regions.get_one_async.assert_awaited_once_with(update_dto.region_id)

    
    async def test_update_one_country_with_valid_inputs_should_update_and_commit(self):
        '''
        Condition : all values are valid
        Expected : invoke create method on countries services and commit 
        '''

        update_dto = self.factory.make_country_update_dto()
        country = self.factory.make_country()
        region = self.factory.make_region()
        new_country = self.factory.make_country()
        country_nested = self.factory.make_country_nested()

        self.uow.countries.get_one_async = AsyncMock(return_value=country)
        self.uow.regions.get_one_async = AsyncMock(return_value=region)
        self.uow.countries.update_one_async = AsyncMock()
        self.country_mapper.from_update_to_model = Mock(return_value=new_country)
        self.country_mapper.from_model_to_nested = Mock(return_value=country_nested)
        self.uow.commit_async = AsyncMock()

        result = await update_one(update_dto,uow=self.uow,country_mapper=self.country_mapper)


        self.uow.countries.get_one_async.assert_awaited_once_with(update_dto.country_id)
        self.uow.regions.get_one_async.assert_awaited_once_with(update_dto.region_id)
        self.country_mapper.from_update_to_model.assert_called_once_with(update_dto,country)
        self.uow.countries.update_one_async.assert_called_once_with(new_country)
        self.uow.commit_async.assert_awaited_once()
        self.country_mapper.from_model_to_nested.assert_called_once_with(new_country)
        self.assertEqual(result,country_nested)
    
    async def test_delete_one_country_not_found_should_raise_HTTPException(self):
        '''
        Objective: deleting a country
        Condition : country does not exist
        Expected-Behaviour : raise HTTPException 404
        '''
        
        country_id = 1
        self.uow.countries.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await delete_one(country_id=country_id,uow=self.uow)
        
        self.assertEqual(ex.exception.status_code,404)
        self.uow.countries.get_one_async.assert_awaited_once_with(country_id)
    
    async def test_delete_one_country_should_succeed(self):
        '''
        Objective : deleting a country
        Condition : country exist
        Expected-Behaviour : call delete on service and commit
        '''
        country_id = 1
        country_to_delete = self.factory.make_country()
        self.uow.countries.get_one_async = AsyncMock(return_value=country_to_delete)
        self.uow.countries.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        await delete_one(country_id=country_id,uow=self.uow)

        self.uow.countries.get_one_async.assert_awaited_once_with(country_id)
        self.uow.countries.delete_one_async.assert_awaited_once_with(country_id)
        self.uow.commit_async.assert_awaited_once()









        









