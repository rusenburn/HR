from unittest.async_case import IsolatedAsyncioTestCase
from unittest.mock import MagicMock, Mock, AsyncMock, PropertyMock
from fastapi import HTTPException
from services.unit_of_work import UnitOfWork0
from services.redis_cache import RedisCacheService
from models import Employee

from mappers.employee_mapper import EmployeeMapper
from DTOs.employees import EmployeeCreate, EmployeeDTO, EmployeeUpdate
from DTOs.nested import EmployeeNested
from services.employees import EmployeeAsyncService
from tests.factory import Factory
from routers import employees as employees_router
import typing


def mock(typ: typing.Type):
    return typing.cast(typ | Mock, Mock(spec=typ))


class EmployeesRouterTest(IsolatedAsyncioTestCase):
    def setUp(self) -> None:
        self.uow = mock(UnitOfWork0)
        self.uow.employees = mock(EmployeeAsyncService)
        self.cache = mock(RedisCacheService)
        self.mapper = mock(EmployeeMapper)

    def tearDown(self) -> None:
        ...

    async def test_get_all_when_no_cache_should_access_db_and_set_cache(self):
        '''
        Objective: get all
        Condition: cache return None
        Expected : access db service and set cache
        '''
        l = 3
        service_result = [mock(Employee) for _ in range(l)]
        self.cache.get_employees = AsyncMock(return_value=None)
        self.uow.employees.get_all_async = AsyncMock(
            return_value=service_result)
        self.cache.set_employees = AsyncMock()
        self.mapper.from_model_to_nested = Mock(
            side_effect=lambda x: mock(EmployeeNested))

        result = await employees_router.get_all(uow=self.uow, employeeQuery={}, cached=self.cache, employee_mapper=self.mapper)

        self.cache.get_employees.assert_awaited_once()
        self.uow.employees.get_all_async.assert_awaited_once()
        self.cache.set_employees.assert_awaited_once_with(service_result)

        self.assertEqual(len(result), l)
        for item in result:
            self.assertIsInstance(item, EmployeeNested)

        for item in service_result:
            self.mapper.from_model_to_nested.assert_any_call(item)

    async def test_get_all_when_cached_should_not_access_db_nor_set_cache(self):
        '''
        Objective: get all
        Condition: cache return value
        Expected : should not access service db nor set cache
        '''
        l = 3
        cache_result = [mock(Employee) for _ in range(l)]
        self.cache.get_employees = AsyncMock(return_value=cache_result)
        self.uow.employees.get_all_async = AsyncMock()
        self.cache.set_employees = AsyncMock()

        await employees_router.get_all(uow=self.uow, employeeQuery={}, cached=self.cache, employee_mapper=self.mapper)

        self.cache.get_employees.assert_awaited_once()
        self.uow.employees.get_all_async.assert_not_called()
        self.cache.set_employees.assert_not_called()

    async def test_get_one_employee_when_not_found_should_return_HTTPException(self):
        '''
        Objective: get one employee
        Condition: service return None
        Expected : raise HTTPException 404 not found
        '''

        employee_id = mock(int)
        self.uow.employees.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await employees_router.get_one(employee_id=employee_id, uow=self.uow, employee_mapper=self.mapper)

        self.assertEqual(ex.exception.status_code, 404)
        self.uow.employees.get_one_async.assert_awaited_once_with(employee_id)

    async def test_get_one_should_return_dto(self):
        '''
        Objective: get one employee
        Condition: valid inputs
        Expected : return dto
        '''

        employee_id = mock(int)
        model = mock(Employee)
        dto = mock(EmployeeDTO)
        self.uow.employees.get_one_async = AsyncMock(return_value=model)
        self.mapper.from_model_to_dto = Mock(return_value=dto)

        result = await employees_router.get_one(employee_id=employee_id, uow=self.uow, employee_mapper=self.mapper)
        self.uow.employees.get_one_async.assert_awaited_once_with(employee_id)
        self.mapper.from_model_to_dto.assert_called_once_with(model)

        self.assertEqual(result, dto)

    async def test_create_one_should_create_commit_and_return_nested_dto(self):
        '''
        Objective: create one employee
        Condition: valid inputs
        Expected : should create , commit and return nested
        '''

        create_dto = mock(EmployeeCreate)
        model = mock(Employee)
        nested = mock(EmployeeNested)

        self.mapper.from_create_to_model = Mock(return_value=model)
        self.uow.employees.create_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()
        self.mapper.from_model_to_nested = Mock(return_value=nested)

        result = await employees_router.create_one(create_dto=create_dto, uow=self.uow, employee_mapper=self.mapper)

        self.mapper.from_create_to_model.assert_called_once_with(create_dto)
        self.uow.employees.create_one_async.assert_awaited_once_with(model)
        self.uow.commit_async.assert_awaited_once()
        self.mapper.from_model_to_nested.assert_called_once_with(model)

        self.assertEqual(result, nested)

    async def test_update_one_employee_not_found_should_raise_404_HTTPException(self):
        '''
        Objective: update one employee
        Condition: service return None ( employee does not exist )
        Expected : raise HTTPException 404
        '''

        update_dto = mock(EmployeeUpdate)
        update_dto.employee_id = mock(int)
        self.uow.employees.get_one_async = AsyncMock(return_value=None)

        with self.assertRaises(HTTPException) as ex:
            await employees_router.update_one(uow=self.uow, update_dto=update_dto, employee_mapper=self.mapper)

        self.assertEqual(ex.exception.status_code, 404)
        self.uow.employees.get_one_async.assert_awaited_once_with(
            update_dto.employee_id)

    async def cases_update_one_employee_manager_id_should_not_check_manager_exist(self, a):
        '''
        Objective: update one employee
        Condition: changed manager id to a (Known cases 0 or None)
        Expected : should not check if manager exist
        '''
        update_dto = mock(EmployeeUpdate)
        update_dto.employee_id = mock(int)
        update_dto.manager_id = a
        model = mock(Employee)

        self.uow.employees.get_one_async = AsyncMock(return_value=model)

        await employees_router.update_one(update_dto=update_dto, uow=self.uow, employee_mapper=self.mapper)
        self.uow.employees.get_one_async.assert_called_once_with(
            update_dto.employee_id)

    async def test_update_one_employee_manager_id_changed_to_0_should_not_check_manager_exist(self):
        '''
        Objective: update one employee
        Condition: changed manager id to 0
        Expected : should not check if manager exist
        '''
        await self.cases_update_one_employee_manager_id_should_not_check_manager_exist(0)

    async def test_update_one_employee_manager_id_changed_to_None_should_not_check_manager_exist(self):
        '''
        Objective: update one employee
        Condition: changed manager id to None
        Expected : should not check if manager exist
        '''
        await self.cases_update_one_employee_manager_id_should_not_check_manager_exist(None)


    async def test_update_one_employee_manager_id_not_none_nor_0_and_changed_should_check_if_manager_exist(self):
        '''
        Objective: update one employee
        Condition: changed manager id not 0 nor None and manager does not exist
        Expected : raise HTTPException 400 Bad request
        '''

        update_dto = mock(EmployeeUpdate)
        update_dto.employee_id = mock(int)
        update_dto.manager_id = mock(int)
        model = mock(Employee)
        model.manager_id = mock(int)

        self.uow.employees.get_one_async = AsyncMock(side_effect=[model,None])

        with self.assertRaises(HTTPException) as ex:
            await employees_router.update_one(update_dto=update_dto,uow=self.uow,employee_mapper=self.mapper)

        self.uow.employees.get_one_async.assert_any_call(update_dto.manager_id)
        self.assertEqual(ex.exception.status_code,400)

    async def test_update_one_employee_valid_input_should_update_commit_and_return_nested(self):
        '''
        Objective: update one employee
        Condition: valid inputs
        Expected : update , commit , return nested dto
        '''

        update_dto = mock(EmployeeUpdate)
        update_dto.employee_id = mock(int)
        update_dto.manager_id = mock(int)
        manager = mock(Employee)
        model = mock(Employee)
        model.manager_id = mock(int)
        update_model = mock(Employee)
        nested = mock(EmployeeNested)

        self.uow.employees.get_one_async = AsyncMock(side_effect=[model,manager])
        self.mapper.from_update_to_model = Mock(return_value=update_model)
        self.mapper.from_model_to_nested = Mock(return_value=nested)
        self.uow.employees.update_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        result = await employees_router.update_one(update_dto=update_dto,uow=self.uow,employee_mapper=self.mapper)

        self.uow.employees.get_one_async.assert_any_await(update_dto.employee_id)
        self.mapper.from_update_to_model.assert_called_once_with(update_dto,model)
        self.uow.employees.update_one_async.assert_awaited_once_with(update_model)
        self.uow.commit_async.assert_awaited_once()
        self.mapper.from_model_to_nested.assert_called_once_with(update_model)

        self.assertEqual(result,nested)
    
    async def test_delete_one_should_delete_and_commit(self):
        '''
        Objective: delete one employee
        Condition: valid inputs
        Expected : delete , commit
        '''
        employee_id = mock(int)

        self.uow.employees.delete_one_async = AsyncMock()
        self.uow.commit_async = AsyncMock()

        await employees_router.delete_one(employee_id=employee_id,uow=self.uow)

        self.uow.employees.delete_one_async.assert_awaited_once_with(employee_id)
        self.uow.commit_async.assert_awaited_once()

