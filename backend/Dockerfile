FROM python

RUN mkdir -p /manthano/server
WORKDIR /manthano/server

RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ buster-pgdg main" > /etc/apt/sources.list.d/PostgreSQL.list'
RUN apt update
RUN apt install postgresql-11 -y

COPY pg_hba.conf /etc/postgresql/11/main/pg_hba.conf

COPY . /manthano/server

RUN /etc/init.d/postgresql start && \
    psql -U postgres -c "CREATE DATABASE manthano" && \
    psql -U postgres -c "CREATE USER root WITH SUPERUSER PASSWORD ''" && \
    psql -U postgres -d manthano -f manthano.sql

RUN pip install -r requirements.txt

CMD ["python", "app.py"]
