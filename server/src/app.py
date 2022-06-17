from fastapi import FastAPI, Depends
from routers import (
    regions,
    countries,
    locations,
    departments,
    jobs,
    employees,
    job_histories,
    users
)
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:4200",
    "http://localhost:8080",
    "http://localhost:8000",
    "http://127.0.0.1:8080"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.include_router(regions.router)
app.include_router(countries.router)
app.include_router(locations.router)
app.include_router(departments.router)
app.include_router(jobs.router)
app.include_router(employees.router)
app.include_router(job_histories.router)
app.include_router(users.router)


def a(b):
    return b


@app.get("/ping/")
def root():
    return "pong"
