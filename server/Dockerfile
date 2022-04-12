FROM python:3.10.4-alpine3.15
WORKDIR /app
RUN apk update && apk add python3-dev \
                        gcc \
                        libc-dev
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./ ./
RUN alembic upgrade head
CMD ["uvicorn" , "src.app:app" ,"--host","0.0.0.0","--port","80"]