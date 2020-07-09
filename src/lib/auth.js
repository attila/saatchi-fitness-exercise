const crypto = require('crypto')
const R = require('ramda')

const generateSalt = length => crypto
  .randomBytes(length)
  .toString('hex')
  .slice(0, length)

const hashString = R.curry((iterations, keylen, digest, input, salt) => crypto
  .pbkdf2Sync(input, salt, iterations, keylen, digest)
  .toString('hex')
)

const hashPassword = R.curry((iterations, keylen, digest, saltLength, input) => R.pipe(
  generateSalt,
  R.converge(
    R.concat,
    [
      R.identity,
      hashString(iterations, keylen, digest, input)
    ]
  )
)(saltLength))

const validatePassword = R.curry((iterations, keylen, digest, saltLength, saltedHash, input) => R.pipe(
  R.take(saltLength),
  R.converge(
    R.equals,
    [
      hashString(iterations, keylen, digest, input),
      R.pipe(R.always(saltedHash), R.drop(saltLength))
    ]
  )
)(saltedHash))

module.exports = {
  hashPassword,
  validatePassword
}
