const jwt = require('jsonwebtoken')
const Entry = require('../models/entry')

module.exports = {
  retakingUser: function(user, survey) {
  	try {
      const entry = Entry.find({ user: user, survey: survey })
      return Boolean(entry)
  	} catch {
  		return false
  	}
  }
}
