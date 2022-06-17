from unittest import TestCase
from unittest import mock
from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import Mock, patch,MagicMock
from services.regions import RegionsService0
from models import Region
from tests.factory import Factory
from DTOs.regions import RegionDTO


class TestRegionsServiceAsync(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.service = RegionsService0(Mock())
        self.factory = Factory()

    
    def tearDown(self) -> None:
        ...

    async def test_create_one_async_should_raise_TypeError(self):
        wrong_type = None
        with self.assertRaises(TypeError):
            await self.service.create_one_async(wrong_type)
        
        wrong_type = self.factory.make_region_dto()
        with self.assertRaises(TypeError):
            await self.service.create_one_async(wrong_type)

        wrong_type = self.factory.make_region_create_dto()
        with self.assertRaises(TypeError):
            await self.service.create_one_async(wrong_type)
    
    
    async def test_create_one_async_should_call_db_once(self):
        region = self.factory.make_region()
        self.service._db.add = Mock(return_value=None)
        await self.service.create_one_async(region)
        self.service._db.add.assert_called_once_with(region)
    
