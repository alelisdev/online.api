<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>


##Added mock server, please read readme file.

## Added description for run and stop container below

## TODO set up docs
## TODO USE environment from secrets (better from K8S) - please do not add env files to the code
## TODO delete action - on pull request
## TODO add config module to have the ability to launch our DB in different environments

## TODO ADD MIGRATIONS IN THE PRODUCTION!!! - in production mode env TYPEORM_SYNCHRONIZE=false  !!! 

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

#Check analysis module and readme in the mock server first
To run container on mac simply use the next address `ws://host.docker.internal:5050` or `ws://localhost:5050`


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode and use the development env 
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov

# docker container start 
$ docker-compose up
# docker container stop 
$ docker-compose down

# start docker container with local db
$ docker-compose -f docker-compose.local-db.yml up
# stop docker container with local db  and delete volume
$ docker-compose -f docker-compose.local-db.yml down -v

# start docker container with local db for dev mode
$ docker-compose -f docker-compose.local-db-only.yml up
# stop docker container with local db for dev mode and delete volume
$ docker-compose -f docker-compose.local-db-only.yml down -v



```






