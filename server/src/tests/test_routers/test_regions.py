from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock,AsyncMock

from fastapi import HTTPException
from DTOs.nested import RegionNested
from DTOs.regions.region_dto import RegionDTO
from routers.regions import create_one,update_one,get_one,get_all,delete_one
from services.unit_of_work import UnitOfWork
from services.redis_cache import RedisCacheService
from mappers.region_mapper import RegionMapper
from tests.factory import Factory

class TestRegionsRouter(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.factory = Factory()
        self.uow : UnitOfWork | Mock= Mock()
        self.uow.regions = Mock()
        self.cache: RedisCacheService | Mock = Mock()
        self.region_mapper : RegionMapper|Mock  = Mock()
    
    def tearDown(self) -> None:
        ...
    
    async def test_get_all_no_cache(self):
        '''
        Test When there is no caching , It should connect to Regions service
        '''
        query = dict()
        regions = [self.factory.make_region() for _ in range(5)]
        self.uow.regions.get_all_async = AsyncMock(return_value=regions)
        self.cache.set_regions = AsyncMock(return_value=None)
        self.cache.get_regions = AsyncMock(return_value=None)
        self.region_mapper.from_model_to_nested = Mock(return_value=self.factory.make_region_nested())

        results = await get_all(uow=self.uow,cache=self.cache,region_mapper=self.region_mapper,query=query)

        self.assertEqual(len(regions),len(results))
        for item in results:
            self.assertTrue(isinstance(item,RegionNested))
        
        self.cache.get_regions.assert_awaited_once()
        self.cache.set_regions.assert_awaited_once_with(regions)
        self.uow.regions.get_all_async.assert_called_once()
        self.uow.regions.get_all_async.assert_awaited_once()
        # self.region_mapper.from_model_to_nested.assert_has_calls(regions,any_order=True)
    
    async def test_get_all_with_cache(self):
        '''
        Test When there is Caching , It should not connect to Regions service
        '''
        query = dict()
        regions = [self.factory.make_region() for _ in range(5)]

        self.cache.get_regions = AsyncMock(return_value=regions)
        self.uow.regions.get_all_async = AsyncMock(return_value=None)
        self.cache.set_regions = AsyncMock(return_value=None)
        self.region_mapper.from_model_to_nested = Mock(return_value=self.factory.make_region_nested())

        results = await get_all(uow=self.uow,cache=self.cache,region_mapper=self.region_mapper,query=query)
        self.assertEqual(len(regions),len(results))

        self.cache.get_regions.assert_awaited_once()
        self.cache.set_regions.assert_not_called()
        self.uow.regions.get_all_async.assert_not_called()
        # self.region_mapper.from_model_to_nested.assert_has_calls(regions,any_order=True)
    
    async def test_get_one_region_not_found(self):
        '''
        Test trying to get non-existed region should return HTTPException 404
        '''
        region_id = 5
        self.uow.regions.get_one_async = AsyncMock(return_value=None)
        
        with self.assertRaises(HTTPException) as ex:
            await get_one(region_id=region_id,uow=self.uow,region_mapper=self.region_mapper)
        
        exception = ex.exception
        self.assertEqual(exception.status_code,404)
        self.uow.regions.get_one_async.assert_called_once_with(region_id)
    
    async def test_get_one_region_found(self):
        '''
        Test trying to get a region that exists in a service
        '''

        region_id = 5
        region = self.factory.make_region()
        self.uow.regions.get_one_async = AsyncMock(return_value=region)
        expected = self.factory.make_region_dto()
        self.region_mapper.from_model_to_dto = Mock(return_value=expected)

        result = await get_one(region_id,self.uow,self.region_mapper)

        self.uow.regions.get_one_async.assert_awaited_once_with(region_id)
        self.region_mapper.from_model_to_dto.assert_called_once_with(region)
        self.assertIsInstance(result,RegionDTO)
        self.assertEqual(expected,result)
    
    async def test_create_one(self):
        '''
        Testing successfully creating a region
        '''
        create_dto = self.factory.make_region_create_dto()
        region = self.factory.make_region()
        dto = self.factory.make_region_dto()

        self.region_mapper.from_create_to_model =Mock(return_value=region)
        self.uow.regions.create_one_async = AsyncMock(return_value=None)
        self.uow.commit_async = AsyncMock(return_value=None)
        self.region_mapper.from_model_to_nested= Mock(return_value=dto)

        result = await create_one(create_dto=create_dto,uow=self.uow,region_mapper=self.region_mapper)

        self.region_mapper.from_create_to_model.assert_called_once_with(create_dto)
        self.uow.regions.create_one_async.assert_awaited_once_with(region)
        self.region_mapper.from_model_to_nested.assert_called_once_with(region)
        self.uow.commit_async.assert_awaited_once()
        self.assertEqual(result,dto)
    
    async def test_update_one_region_not_found(self):
        '''
        Testing updating a non-existed region should raise HTTPException 404
        '''
        update_dto = self.factory.make_region_update_dto()
        self.uow.regions.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await update_one(region_update_dto=update_dto,uow=self.uow,region_mapper=self.region_mapper)
        
        exception = ex.exception
        self.assertEqual(exception.status_code,404)
        self.uow.regions.get_one_async.assert_awaited_once_with(update_dto.region_id)
    
    async def test_update_one_existed_region(self):
        '''
        Testing updating an already existed region should succeed
        '''
        update_dto = self.factory.make_region_update_dto()
        existed_region = self.factory.make_region()
        region_to_update = self.factory.make_region()
        dto = self.factory.make_region_nested()

        self.uow.regions.get_one_async = AsyncMock(return_value=existed_region)
        self.uow.regions.update_one_async = AsyncMock(return_value=None)
        self.uow.commit_async = AsyncMock()
        self.region_mapper.from_update_to_model = Mock(return_value=region_to_update)
        self.region_mapper.from_model_to_nested = Mock(return_value=dto)

        result = await update_one(region_update_dto=update_dto,uow=self.uow,region_mapper=self.region_mapper)

        self.assertEqual(dto,result)
        self.uow.regions.get_one_async.assert_awaited_once_with(update_dto.region_id)
        self.uow.regions.update_one_async.assert_awaited_once_with(region_to_update)
        self.uow.commit_async.assert_awaited_once()
        self.region_mapper.from_update_to_model.assert_called_once_with(update_dto,existed_region)
        self.region_mapper.from_model_to_nested.assert_called_once_with(region_to_update)

    async def test_delete_one_region_not_found(self):
        '''
        Testing deleting a region that does not exist should return HTTPException 404
        '''

        region_id = 1
        self.uow.regions.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await delete_one(region_id=region_id,uow=self.uow)
        exception = ex.exception

        self.assertEqual(exception.status_code,404)
        self.uow.regions.get_one_async.assert_awaited_once_with(region_id)
    
    async def test_delete_one_region_exist_should_success(self):
        '''
        Testing deleting an existed region should succeed
        '''

        region_id = 1
        region = self.factory.make_region()
        self.uow.regions.get_one_async = AsyncMock(return_value=region)
        self.uow.regions.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        await delete_one(region_id=region_id,uow=self.uow)
        
        self.uow.regions.get_one_async.assert_awaited_once_with(region_id)
        self.uow.regions.delete_one_async.assert_awaited_once_with(region_id)
        self.uow.commit_async.assert_awaited_once()

        









    