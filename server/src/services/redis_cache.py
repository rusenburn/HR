from datetime import datetime, timedelta
import os
from typing import Any, Awaitable, Callable, Coroutine, Iterable, TypeVar
import typing
import redis
from redis.asyncio.client import Redis

from models import Region, Country, Job, Employee, Department, JobHistory,Location
import pickle


REDIS_URL = "redis://localhost"
CACHE_TIME_IN_MINUTES = 5
if "REDIS_URL" in os.environ:
    REDIS_URL = os.environ["REDIS_URL"]

T= TypeVar('T')
U = TypeVar('U')

def do_if_connected(func:Callable[[Any,U],Awaitable[T]|None])->Callable[[Any],Awaitable[T]|None] | Callable[[Any,U],Awaitable]:
    async def wrapper(*args:tuple[Any,U]|tuple[Any])->T:
        if isinstance(args,Iterable):
            self = typing.cast(RedisCacheService,args[0])
        else:
            self = typing.cast(RedisCacheService,args)
        if datetime.utcnow() < self._next_connection_attemp:
            return None
        try:
            return await func(*args)
        except redis.exceptions.ConnectionError as ex:
            self._increase_connection()
            return None
    return wrapper

class RedisCacheService:
    _next_connection_attemp = datetime.utcnow()
    _connection__attemp_intervals = timedelta(seconds=30)

    def __init__(self, redis: Redis) -> None:
        if not isinstance(redis,Redis):
            raise TypeError(f"Redis service require {Redis.__class__} type , passed type is {redis.__class__}")
        self._db = redis

    @do_if_connected
    async def set_regions(self, regions: list[Region]):
        if regions is None:
                raise TypeError("TypeError: Cannot cache null objects.")
        encoded = pickle.dumps(regions)
        await self._db.set("regions", encoded, CACHE_TIME_IN_MINUTES*60)
        
    @do_if_connected
    async def get_regions(self) -> list[Region]:
        encoded = await self._db.get("regions")
        if encoded is None:
            return None
        regions = pickle.loads(encoded)
        return regions

    @do_if_connected
    async def set_countries(self, countries: list[Country]):
        if countries is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        encoded = pickle.dumps(countries)
        await self._db.set("countries", encoded, CACHE_TIME_IN_MINUTES*60)
        

    @do_if_connected
    async def get_countries(self) -> list[Country]:
        encoded = await self._db.get("countries")
        if encoded is None:
            return encoded
        countries = pickle.loads(encoded)
        return countries
        

    @do_if_connected
    async def set_jobs(self, jobs: list[Job]) -> None:
        if jobs is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        encoded = pickle.dumps(jobs)
        await self._db.set("jobs", encoded, CACHE_TIME_IN_MINUTES*60)


    @do_if_connected
    async def get_jobs(self) -> list[Job]:
        encoded = await self._db.get("jobs")
        if encoded is None:
            return encoded
        jobs = pickle.loads(encoded)
        return jobs

    @do_if_connected
    async def set_departments(self, departments: list[Department]) -> None:
        if departments is None:
            raise TypeError("TypeError: Cannot cache null objects.")
    
        encoded = pickle.dumps(departments)
        await self._db.set("departments", encoded, CACHE_TIME_IN_MINUTES*60)

    @do_if_connected
    async def get_departments(self) -> list[Department]:
        encoded = await self._db.get("departments")
        if encoded is None:
            return encoded
        departments = pickle.loads(encoded)
        return departments


    @do_if_connected
    async def set_employees(self, employees: list[Employee]) -> None:
        if employees is None:
            raise TypeError("TypeError: Cannot cache null objects.")

        encoded = pickle.dumps(employees)
        await self._db.set("employees", encoded, CACHE_TIME_IN_MINUTES*60)


    @do_if_connected
    async def get_employees(self) -> list[Employee]:
        encoded = await self._db.get("employees")
        if encoded is None:
            return encoded
        employees = pickle.loads(encoded)
        return employees
        

    @do_if_connected
    async def get_locations(self)->list[Location]:
        encoded = await self._db.get("locations")
        if encoded is None:
            return encoded
        locations = pickle.loads(encoded)
        return locations


    @do_if_connected
    async def set_locations(self,locations:list[Location]):
        if locations is None:
            raise TypeError("TypeError: Cannot cache null objects.")

        encoded = pickle.dumps(locations)
        await self._db.set("locations", encoded, CACHE_TIME_IN_MINUTES*60)

    @do_if_connected
    async def get_job_history(self)->list[JobHistory]:
        encoded = await self._db.get("job_history")
        if encoded is None:
            return None
        job_history =  pickle.loads(encoded)
        return job_history
    
    @do_if_connected
    async def set_job_history(self,job_history:list[JobHistory]):
        if job_history is None:
            raise TypeError(f"job_history type cannot be None")
        encoded = pickle.dumps(job_history)
        await self._db.set("job_history",encoded,CACHE_TIME_IN_MINUTES * 60)

    @classmethod
    def _increase_connection(cls):
        cls._next_connection_attemp = datetime.utcnow() + cls._connection__attemp_intervals







