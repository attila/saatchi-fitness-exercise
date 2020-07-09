const { EntrySchema } = require('../schema/entry')

const createEntry = async (db, session, data) => {
  const Entry = db.model('Entry', EntrySchema)

  const payload = !session.user.isAdmin
    ? { ...data, participant: session.user.name }
    : { ...data }

  const entry = new Entry(payload)

  return entry.save()
}

const updateEntry = async (db, _id, data) => {
  const Entry = db.model('Entry', EntrySchema)

  return Entry.updateOne({ _id }, data)
}

const deleteEntry = async (db, _id) => {
  const Entry = db.model('Entry', EntrySchema)

  return Entry.deleteOne({ _id })
}

const getEntry = async (db, _id) => {
  const Entry = db.model('Entry', EntrySchema)

  return Entry.findOne({ _id })
}

const getEntries = (db, session) => {
  const Entry = db.model('Entry', EntrySchema)

  // Automatically filter to current user name if non-admin.
  const entryFilters = session.user.isAdmin ? {} : { participant: session.user.name }

  return Entry.find(entryFilters)
}

module.exports = {
  createEntry,
  updateEntry,
  deleteEntry,
  getEntry,
  getEntries
}
