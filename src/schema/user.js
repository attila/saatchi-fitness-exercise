const { Schema } = require('mongoose')

const UserSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  pass: String,
  isAdmin: Boolean
})

module.exports = { UserSchema }
