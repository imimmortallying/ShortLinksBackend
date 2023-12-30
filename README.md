# shortlinks backend

## Develop

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