const jwt = require('jsonwebtoken')

module.exports = {
  auth: function(req, res, next) {
  	try {
      const token = req.header('Authorization').split(' ')[1]
      if (!token) return res.status(401).json({ message: 'Auth error' })
  		const decoded = jwt.verify(token, 'randomString')
  		req.user = decoded.user
  		next()
  	} catch (e) {
  		console.log(e)
  		res.status(500).send({ message: 'Invalid token' })
  	}
  },
  authAdmin: function(req, res, next) {
  	try {
      const token = req.header('Authorization').split(' ')[1]
      if (!token) return res.status(401).json({ message: 'Auth error' })
  		const decoded = jwt.verify(token, 'randomString')
      if (decoded.user.role !== 'COORDINATOR')
        return res.status(401).json({ message: 'User isn\'t a coordinator' })
      req.user = decoded.user
  		next()
  	} catch (e) {
  		console.log(e)
  		res.status(500).send({ message: 'Invalid token' })
  	}
  },
  setRequestUser: function(req, res, next) {
  	try {
      const token = req.header('Authorization').split(' ')[1]
      if (token) {
        const decoded = jwt.verify(token, 'randomString')
        req.user = decoded.user
      }
  		next()
  	} catch (e) {
      console.log(e)
  		next()
  	}
  }
}
