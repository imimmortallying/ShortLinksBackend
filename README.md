# shortlinks app: backend


## About project:
App allows to convert an URL address into a short version.

Registered and authorised users can see all their links and set their lifetime.
Registration and authorisation is implemented using a pair of access/refresh JWT tokens stored in cookies and local storage.
Anonymous users live in the system with the help of JS-fingerprint. Their links are saved on backend for 5 days.

DDD methodology has been used as the architecture.

## Technology stack:
* Express.js
* DB: mongoDB
* ORM: mongoose
* Express validator library
* fp-ts TypeScript library

## Installation

Clone the repository and install dependencies:

```sh
git clone https://github.com/imimmortallying/ShortLinksBackend.git
```

```sh
yarn install
```

## Deploy

**Run** from the root of repository

```sh
docker compose -p shortlinks-dev  -f .\manifest\docker-compose.yaml  up -d
```

**Stop** docker compose project

```sh
docker compose -p shortlinks-dev down
```

## Configuration

* `SL_SERVICE__PORT`

    Service public port for API hosting (default: `5000`)

* `SL_SERVICE__MONGO_URL`

    Connection string for MongoDB (default: `mongodb://0.0.0.0:27017`)