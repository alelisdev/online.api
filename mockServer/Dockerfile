FROM python:3.7-alpine3.12

FROM continuumio/anaconda

LABEL mantainer="Alex"


WORKDIR code
ADD ./code /code


RUN pip install flask
RUN pip install gevent
RUN pip install gevent-websocket




CMD ["python", "app.py"]

