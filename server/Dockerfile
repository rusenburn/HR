FROM python:3.10.4-alpine3.15
WORKDIR /app
RUN apk update && apk add python3-dev \
                        gcc \
                        libc-dev \
                        libffi-dev
COPY ./requirements.txt ./requirements.txt
RUN pip install --no-cache-dir --upgrade -r ./requirements.txt
COPY ./ ./
RUN ["chmod","+x","./scripts/run_server.sh"]
ENTRYPOINT [ "./scripts/run_server.sh" ]