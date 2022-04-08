from fastapi import FastAPI, Depends
from .routers import regions

app = FastAPI()

app.include_router(regions.router)

@app.get("/ping/")
def root():
    return "pong"


