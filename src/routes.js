const { OK, CREATED, UNAUTHORIZED, NOT_FOUND, INTERNAL_SERVER_ERROR } = require('http-status-codes')
const R = require('ramda')
const { createUser, deleteUser, getUser, getUsers, loginUser } = require('./module/user')
const { createEntry, updateEntry, deleteEntry, getEntry, getEntries } = require('./module/entry')
const db = require('./lib/db')
const logger = require('./lib/logger')

const isAdmin = R.pathEq(['session', 'user', 'isAdmin'], true)
const isAnonymous = R.complement(R.hasPath(['session', 'user']))
const isAuthenticated = R.hasPath(['session', 'user'])

const requireCondition = predicate => (req, res, next) => {
  if (predicate(req)) {
    next()
  } else {
    res.status(UNAUTHORIZED).send('Unauthorised')
  }
}

const routes = app => {
  // Login / Logout
  app.post('/login', requireCondition(isAnonymous), async (req, res) => {
    const { name, password } = req.body

    try {
      req.session.user = await loginUser(db, { name, password })
      res.status(OK).send({
        message: 'Login successful'
      })
    } catch (err) {
      logger.error(err)
      res.status(UNAUTHORIZED).send('Username or password does not match')
    }
  })

  app.get('/logout', requireCondition(isAuthenticated), async (req, res) => {
    req.session.destroy()
    res.status(OK).send('Logged out')
  })

  // Account CRUD
  app.get('/accounts', requireCondition(isAdmin), async (req, res) => {
    try {
      const users = await getUsers(db)
      res.status(OK).send(users)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.get('/account/:name', requireCondition(isAdmin), async (req, res) => {
    try {
      const name = req.params.name
      const result = await getUser(db, name)
      res.status(OK).send(result)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.post('/account', requireCondition(isAdmin), async (req, res) => {
    try {
      const { name, password, isAdmin } = req.body
      const user = await createUser(db, { name, password, isAdmin })
      console.log({ user })
      res.status(CREATED).send({
        message: 'Account created',
        user: { name: user.name, isAdmin: user.isAdmin }
      })
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.delete('/account/:name', requireCondition(isAdmin), async (req, res) => {
    try {
      const name = req.params.name
      const result = await deleteUser(db, name)

      if (result.deletedCount === 0) {
        res.status(NOT_FOUND).send('User not found or could not be deleted')
      } else {
        res.status(OK).send(result)
      }
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  // Entries CRUD
  app.get('/entries', requireCondition(isAuthenticated), async (req, res) => {
    try {
      const entries = await getEntries(db, req.session)
      res.status(OK).send(entries)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.post('/entry', requireCondition(isAuthenticated), async (req, res) => {
    const { participant, exercise, duration, date } = req.body

    try {
      const entry = await createEntry(db, req.session, { participant, exercise, duration, date })
      res.status(OK).send(entry)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.put('/entry/:id', requireCondition(isAdmin), async (req, res) => {
    try {
      const id = req.params.id
      const entry = await updateEntry(db, id, req.body)
      res.status(OK).send(entry)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.delete('/entry/:id', requireCondition(isAdmin), async (req, res) => {
    try {
      const id = req.params.id
      const result = await deleteEntry(db, id)

      if (result.deletedCount === 0) {
        res.status(NOT_FOUND).send('Entry not found or could not be deleted')
      } else {
        res.status(OK).send(result)
      }
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  app.get('/entry/:id', requireCondition(isAdmin), async (req, res) => {
    try {
      const id = req.params.id
      const entry = await getEntry(db, id)
      res.status(OK).send(entry)
    } catch (err) {
      logger.error(err)
      res.status(INTERNAL_SERVER_ERROR).send(err.message.toString())
    }
  })

  // Catch all 404
  app.get('*', (req, res) => {
    res.status(NOT_FOUND).send('Not Found')
  })

  return app
}

module.exports = routes
