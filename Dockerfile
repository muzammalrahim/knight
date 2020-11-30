FROM python:3
ENV PYTHONUNBUFFERED=1
WORKDIR /code
COPY requirements.txt /code/
RUN pip install -r requirements.txt
COPY . /code/

EXPOSE 8000

# for production purpose
CMD exec gunicorn backend.wsgi:application --bind 0.0.0.0:8000
