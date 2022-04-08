from fastapi import FastAPI, Depends
from .routers import regions
from .routers import countries

app = FastAPI()

app.include_router(regions.router)
app.include_router(countries.router)


@app.get("/ping/")
def root():
    return "pong"


