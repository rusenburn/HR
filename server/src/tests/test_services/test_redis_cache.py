from base64 import encode
from contextlib import AsyncContextDecorator
import pickle
import typing
from unittest.async_case import IsolatedAsyncioTestCase
import datetime
from unittest.mock import AsyncMock, Mock,patch
from redis.asyncio.client import Redis
from redis import Redis as SyncRedis
from models import JobHistory
from redis.exceptions import ConnectionError
from services.redis_cache import RedisCacheService,CACHE_TIME_IN_MINUTES



def mock(typ: typing.Type):
    return typing.cast(typ | Mock, Mock(spec=typ))

class RedisCacheServiceTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.db = typing.cast(Redis|Mock,AsyncMock(Redis))
        self.service = RedisCacheService(redis=self.db)
        self.service._next_connection_attemp = datetime.datetime.utcnow()
    
    def tearDown(self) -> None:
        ...
    
    def test_instantiate_redis_with_wrong_redis_type_should_raise_TypeError(self):
        '''
        '''
        passed_Values = [None,Mock(int),5,"Hello",Mock(SyncRedis)]
        for v in passed_Values:
            with self.assertRaises(TypeError):
                RedisCacheService(redis=v)
    
    # async def test_get_job_history_can_be_called_and_awaited(self):
    #     '''
    #     '''
    #     await self.service.get_job_history()
    
    async def test_get_job_history_should_get_history_from_db(self):
        '''
        '''
        self.db.get = AsyncMock(return_value=None)
        result = await self.service.get_job_history()
        self.db.get.assert_awaited_once()
        self.assertEqual(result,None)
    
    async def test_get_job_history_when_cache_is_not_None_should_return_decoded_cache(self):
        '''
        '''
        encoded = Mock()
        job_history = Mock()

        self.db.get = AsyncMock(return_value=encoded)
        with patch('pickle.loads') as pickled:
            # pickle.loads = Mock(return_value=job_history)
            pickled.return_value = job_history
            result = await self.service.get_job_history()


        self.db.get.assert_awaited_once()
        self.assertEqual(result,job_history)
    

    async def test_set_job_history(self):
        '''
        '''
        self.db.set = AsyncMock()
        with self.assertRaises(TypeError) as ex:
            await self.service.set_job_history(None)
        self.db.set.assert_not_called()

    async def test_set_job_history_can_be_called_and_awaited(self):
        '''
        '''
        job_history_list = [JobHistory() for _ in range(3)]
        self.db.set = AsyncMock()
        with patch('pickle.dumps') as mocked:
            encoded = Mock()
            mocked.return_value = encoded
            await self.service.set_job_history(job_history_list)
            mocked.assert_called_once_with(job_history_list)
            self.db.set.assert_awaited_once_with("job_history",encoded,CACHE_TIME_IN_MINUTES*60)

    async def test_get_job_history_not_to_call_cache_when_first_attemp_failed(self):
        '''
        '''

        self.db.get = AsyncMock(side_effect=ConnectionError())
        
        try:
            await self.service.get_job_history()
        except ConnectionError:
            self.db.get = AsyncMock(return_value=None)
            await self.service.get_job_history()
            self.db.get.assert_not_called()
    
    async def test_set_job_history_not_to_call_when_first_attemp_failed(self):
        '''
        '''

        self.db.set = AsyncMock(side_effect=ConnectionError())
        to_cache = [JobHistory() for _ in range(3)]
        try:
            await self.service.set_job_history(to_cache)
        except ConnectionError:
            self.db.set =  AsyncMock(return_value=Mock())
            await self.service.set_job_history(to_cache)
            self.db.set.assert_not_called()

    async def test_set_then_get_job_history_should_work(self):
        '''
        '''
        value_to_be_cached = [i for i in range(3)]
        self.db.set = AsyncMock()

        await self.service.set_job_history(value_to_be_cached)
        z =  self.db.set.call_args[0]
        encoded =z[1]
        self.db.get = AsyncMock(return_value=encoded)
        result = await self.service.get_job_history()
        for x,y in list(zip(value_to_be_cached,result)):
            self.assertEqual(x,y)

    








    

    
