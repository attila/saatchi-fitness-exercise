const config = require('config')
const app = require('./app')
const logger = require('./lib/logger')

const port = config.get('server.port')

app.listen(port, () => logger.info(`Server started on port ${port}`))
