from argparse import ArgumentError
import os
import redis
from redis.asyncio.client import Redis

from ..models import Region, Country, Job,Employee,Department,JobHistory
import pickle

REDIS_URL = "redis://localhost"
CACHE_TIME_IN_MINUTES = 5
if "REDIS_URL" in os.environ:
    REDIS_URL = os.environ["REDIS_URL"]


class RedisCacheService:
    def __init__(self, redis: Redis) -> None:
        self._db = redis
        self._connection = True

    async def set_regions(self, regions: list[Region]):
        if not self._connection:
            return
        try:
            if regions is None:
                raise ArgumentError(regions, "Cannot cache null objects.")
            encoded = pickle.dumps(regions)
            await self._db.set("regions", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None

    async def get_regions(self) -> list[Region] | None:
        if not self._connection:
            return None
        try:
            encoded = await self._db.get("regions")
            if encoded is None:
                return None
            regions = pickle.loads(encoded)
            return regions
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None

    async def set_countries(self, countries: list[Country]):
        if countries is None:
            raise ArgumentError(countries, "Cannot cache null objects.")
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(countries)
            await self._db.set("countries", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False

    async def get_countries(self) -> list[Country]:
        if not self._connection:
            return None
        try:
            encoded = await self._db.get("countries")
            if encoded is None:
                return encoded
            countries = pickle.loads(encoded)
            return countries
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None

    async def set_jobs(self, jobs: list[Job]) -> None:
        if not self._connection:
            return
        if jobs is None:
            raise ArgumentError(jobs, "Cannot cache null objects.")
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(jobs)
            await self._db.set("jobs", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False

    async def get_jobs(self) -> list[Job]:
        if not self._connection:
            return None
        try:
            encoded = await self._db.get("jobs")
            if encoded is None:
                return encoded
            jobs = pickle.loads(encoded)
            return jobs
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None
    

    async def set_departments(self,departments:list[Department])->None:
        if not self._connection:
            return
        if departments is None:
            raise ArgumentError(departments, "Cannot cache null objects.")
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(departments)
            await self._db.set("departments", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False

    async def get_departments(self)->list[Department]:
        if not self._connection:
            return None
        try:
            encoded = await self._db.get("departments")
            if encoded is None:
                return encoded
            departments = pickle.loads(encoded)
            return departments
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None

    async def set_employees(self,employees:list[Employee])->None:
        if not self._connection:
            return
        if employees is None:
            raise ArgumentError(employees, "Cannot cache null objects.")
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(employees)
            await self._db.set("employees", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False
    
    async def get_employees(self)->list[Employee]:
        if not self._connection:
            return None
        try:
            encoded = await self._db.get("employees")
            if encoded is None:
                return encoded
            employees = pickle.loads(encoded)
            return employees
        except redis.exceptions.ConnectionError:
            self._connection = False
            return None
