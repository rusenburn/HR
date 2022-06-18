from datetime import datetime, timedelta
import os
import redis
from redis.asyncio.client import Redis

from models import Region, Country, Job, Employee, Department, JobHistory,Location
import pickle


REDIS_URL = "redis://localhost"
CACHE_TIME_IN_MINUTES = 5
if "REDIS_URL" in os.environ:
    REDIS_URL = os.environ["REDIS_URL"]


class RedisCacheService:
    _next_connection_attemp = datetime.utcnow()
    _connection__attemp_intervals = timedelta(seconds=30)

    def __init__(self, redis: Redis) -> None:
        self._db = redis

    async def set_regions(self, regions: list[Region]):
        if regions is None:
                raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = pickle.dumps(regions)
            await self._db.set("regions", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def get_regions(self) -> list[Region] | None:
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = await self._db.get("regions")
            if encoded is None:
                return None
            regions = pickle.loads(encoded)
            return regions
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def set_countries(self, countries: list[Country]):
        if countries is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = pickle.dumps(countries)
            await self._db.set("countries", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._increase_connection()

    async def get_countries(self) -> list[Country]:
        if datetime.utcnow() < self._next_connection_attemp:
            return None
        try:
            encoded = await self._db.get("countries")
            if encoded is None:
                return encoded
            countries = pickle.loads(encoded)
            return countries
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def set_jobs(self, jobs: list[Job]) -> None:
        if jobs is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = pickle.dumps(jobs)
            await self._db.set("jobs", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._increase_connection()

    async def get_jobs(self) -> list[Job]:
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = await self._db.get("jobs")
            if encoded is None:
                return encoded
            jobs = pickle.loads(encoded)
            return jobs
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def set_departments(self, departments: list[Department]) -> None:
        if departments is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = pickle.dumps(departments)
            await self._db.set("departments", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._increase_connection()

    async def get_departments(self) -> list[Department]:
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = await self._db.get("departments")
            if encoded is None:
                return encoded
            departments = pickle.loads(encoded)
            return departments
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def set_employees(self, employees: list[Employee]) -> None:
        if employees is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(employees)
            await self._db.set("employees", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False

    async def get_employees(self) -> list[Employee]:
        if datetime.utcnow() < self._next_connection_attemp:
            return
        try:
            encoded = await self._db.get("employees")
            if encoded is None:
                return encoded
            employees = pickle.loads(encoded)
            return employees
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def get_locations(self)->list[Location]:
        if datetime.utcnow() < self._next_connection_attemp:
            return None
        try:
            encoded = await self._db.get("locations")
            if encoded is None:
                return encoded
            locations = pickle.loads(encoded)
            return locations
        except redis.exceptions.ConnectionError:
            self._increase_connection()
            return None

    async def set_locations(self,locations:list[Location]):
        if locations is None:
            raise TypeError("TypeError: Cannot cache null objects.")
        if datetime.utcnow() < self._next_connection_attemp:
            return
        if not self._connection:
            return
        try:
            encoded = pickle.dumps(locations)
            await self._db.set("locations", encoded, CACHE_TIME_IN_MINUTES*60)
        except redis.exceptions.ConnectionError:
            self._connection = False

    @classmethod
    def _increase_connection(cls):
        cls._next_connection_attemp = datetime.utcnow() + cls._connection__attemp_intervals
