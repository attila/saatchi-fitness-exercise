const config = require('config')
const R = require('ramda')
const { UserSchema } = require('../schema/user')
const { hashPassword, validatePassword } = require('../lib/auth')

const { iterations, keylen, digest, saltLength } = config.get('passwords')

const createUser = (db, { name, password, isAdmin }) => {
  const pass = hashPassword(iterations, keylen, digest, saltLength, password)

  const User = db.model('User', UserSchema)
  const user = new User({ name, pass, isAdmin })

  return user.save()
}

const deleteUser = (db, name) => {
  const User = db.model('User', UserSchema)

  return User.deleteOne({ name })
}

const getUsers = db => {
  const User = db.model('User', UserSchema)

  return User.find()
}

const getUser = (db, name) => {
  const User = db.model('User', UserSchema)

  return User.findOne({ name })
}

const getUserById = (db, _id) => {
  const User = db.model('User', UserSchema)

  return User.findOne({ _id })
}

const loginUser = async (db, { name, password }) => {
  const User = db.model('User', UserSchema)

  return User
    .findOne({ name })
    .orFail()
    .then(user => {
      const isValid = validatePassword(iterations, keylen, digest, saltLength, user.pass, password)

      if (!isValid) {
        throw new Error('invalid password')
      }

      return R.pick(['_id', 'name', 'isAdmin'], user)
    })
}

module.exports = {
  createUser,
  deleteUser,
  getUsers,
  getUser,
  getUserById,
  loginUser
}
