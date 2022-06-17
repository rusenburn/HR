#!/bin/sh
cd "${0%/*}"
cd ../src/
alembic upgrade head
uvicorn app:app --host 0.0.0.0 --port 80 --workers 4