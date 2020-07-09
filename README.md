# Fitness App Exercise (SFE)

This is a RESTful API that interacts with a configured MongoDB instance.

## Prerequisites

* Node.js >= 12.18.2
* Yarn
* Docker (optional)
* API client/front-end (e.g Postman)

## Usage

### Node version

Ensure that the current shell session has the required Node.js version available. If [nvm][nvm] is installed, just issue the following command in the repository root:

```shell script
nvm use
```

### Install dependencies

```shell script
yarn
```

### Database connection

#### On MongoDB Atlas

A standard MongoDB Atlas connection URI can be passed to the API via the `MONGO_URI` environment variable. Example:

```shell script
MONGO_URI="mongodb+srv://user:pass@clusterxxx.mongodb.net/dbname" yarn start
``` 

For developer convenience, the connection URI can be stored in `config/local.yml`, example:

```yaml
db:
  uri: mongodb+srv://user:pass@clusterxxx.mongodb.net/dbname
```

Read more about how [configuration][config] works.

#### Running MongoDB locally via Docker

```shell script
docker-compose up
```

This will pull the Docker image for Mongo and build the container for the API. Connection to the local instance is already configured. Data will not persist after the Mongo container is stopped.

## API Endpoints

Refer to the Postman Collection in the `/resources` folder of this repository.


[nvm]: https://github.com/creationix/nvm#installation-and-update
[config]: /docs/CONFIGURATION.md
