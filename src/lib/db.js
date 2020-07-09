const mongoose = require('mongoose')
const config = require('config')
const logger = require('./logger')

const { uri, options } = config.get('db')

mongoose.connect(uri, options)

const db = mongoose.connection

db.on('error', err => logger.error(err))

module.exports = db
