# manthano

**µanthánō** is a prototypic visual programming environment that I built as part of my master's thesis.

The client is built with React. The server is built with Python Flask.

This repository includes a docker compose file which allows you to try the web application.

## Prerequisites

To run the web application you need to install [Docker Compose](https://docs.docker.com/compose/install/).

Moreover, you need to be able to execute some basic Terminal commands.

## Run application

Open a Terminal and navigate to the project directory. In my case:

```
cd Documents/manthano
```

Then, in the directory you need to run Docker Compose:

```
docker-compose up
```

When you run this command the first time, it will build both Docker containers for the client and server.

From time to time the build of the Docker container for the server fails, because of the PostgreSQL database. Simply execute the Docker Compose command again.

Once the Docker containers are up, you can navigate to `localhost` in a browser of your choice.
