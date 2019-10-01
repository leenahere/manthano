docker container run -v $PWD/../frontend/manthano-app/:/home -p 8080:3000 --rm -d manthano-frontend

docker container run --name running-manthano-backend -v $PWD/../backend/:/home -p 80:80 --rm -d manthano-backend
docker exec -d running-manthano-backend /etc/init.d/postgresql start
docker exec -d running-manthano-backend psql -U postgres -c "CREATE DATABASE manthano"
docker exec -d running-manthano-backend psql -U postgres -c "CREATE USER root WITH SUPERUSER PASSWORD ''"
docker exec -d running-manthano-backend psql -U postgres -d manthano -f /home/manthano.sql
