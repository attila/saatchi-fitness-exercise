const { Schema } = require('mongoose')

const EntrySchema = new Schema({
  participant: String,
  exercise: String,
  duration: Number,
  date: {
    type: Date,
    default: Date.now
  }
})

module.exports = { EntrySchema }
