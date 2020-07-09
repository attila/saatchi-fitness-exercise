# Configuration

Configuration for services is managed via the [Config][node-config] module and are stored in YAML files in the `/config` directory.

## Config files

| File                                 | Description                                                                                                                                                                        |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| default.yml                          | Default values apply where there is no override from other configuration files or environment variables. This file should not contain any environment specific values if possible. |
| custom-environment-variables.yml     | Values that can be overridden from the environment are defined here. Deployed environments are expected to set some values via this method.                                        |
| (development,production,sandbox).yml | Values in these files override defaults from default.yml when the application is launched with the respective value of the environment variable `NODE_CONFIG_ENV`                  |
| local.yml                            | Overrides for a local development environment can be specified in this file. **This file should never be checked into the repository.**                                            |

## Usage

### Basic usage

To add a new configuration value just add it to the tree in `default.yml`

Example:

```yml
# default.yml
dynamoDb:
  tableName: some-table
```

Then in module code:

```javascript
// app.js
const config = require("config");

const tableName = config.get("dynamoDb.tableName");
console.log('Table name is "%s"', tableName);
```

So running the file will just print out the default configuration value:

```bash
node app.js
Table name is "some-table"
```

### Overrides for local or deployed environments

The name of the deployed environment can be set via `NODE_ENV` or, where it is more practical, via `NODE_CONFIG_ENV` environment variables. The value of this will make `config` look up respective configuration files and will _merge_ the overrides with the defaults.

```yml
# staging.yml
dynamoDb:
  tableName: some-table-staging
```

Then if the environment is set, configuration is merged automatically:

```bash
NODE_CONFIG_ENV=staging node app.js
Table name is "some-table-staging"
```

The special `local.yml` configuration file will always take precedence from other environments therefore local.yml can be used to aid integration development from developer sandboxes. For this reason, `local.yml` should never be checked into the repository.

### Overrides from the environment

To override a configuration value from an environment variable, specify the name of the value in `config/custom-environment-variables.yml`:

```yml
# custom-environment-variables.yml
dynamoDb:
  tableName: DYNAMODB_TABLE_NAME
```

Then if the `DYNAMODB_TABLE_NAME` environment variable is set it will take precedence over any configuration files:

```bash
NODE_CONFIG_ENV=staging DYNAMODB_TABLE_NAME=foobar node app.js
Table name is "foobar"
```

## Integration with Serverless

The override logic described above makes it easy to share configuration from `serverless.yml` by exposing these values as environment variables for the lambda functions. These would then be picked up by `config` providing seamless integration with the application source code.

The name of the environment, i.e serverless _stage_ should be exposed via the `NODE_CONFIG_ENV` environment variable.

## Secrets injection

Secrets should never be stored in config files or set via environment variables.

## Caveats

- The config object prototype contains extra methods and some 3rd party modules may require plain objects as configuration parameters. In order to pass in a plain object, run it through `config.util.toObject()`. Code in this repository do not currently contain components that need this.

  [node-config]: http://lorenwest.github.io/node-config/
