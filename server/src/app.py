from fastapi import FastAPI, Depends
from .routers import regions,countries,locations,departments,jobs


app = FastAPI()

app.include_router(regions.router)
app.include_router(countries.router)
app.include_router(locations.router)
app.include_router(departments.router)
app.include_router(jobs.router)
def a(b):
    return b

@app.get("/ping/")
def root():
    return "pong"


