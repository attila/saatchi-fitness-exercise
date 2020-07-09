const config = require('config')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session)

const mongooseConnection = require('./lib/db')
const routes = require('./routes')

const sessionOptions = config.get('session')
const app = express()

// Cookie parser middleware.
app.use(cookieParser())
// Body parser middleware.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Mongo sessions middleware.
app.use(session({
  ...sessionOptions,
  store: new MongoStore({ mongooseConnection })
}))

// Routes.
const appWithRoutes = routes(app)

module.exports = appWithRoutes
