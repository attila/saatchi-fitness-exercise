const { name } = require('../../package')
const config = require('config')
const pino = require('pino')
const R = require('ramda')

const defaults = {
  level: 'info',
  base: null,
  timestamp: false,
  prettyPrint: false
}

const options = R.mergeDeepRight(defaults, config.get('log'))

const logger = pino({
  name,
  ...options
})

module.exports = logger
