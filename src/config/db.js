const mongoose = require('mongoose')

const MONGOURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/menuapp'

mongoose.set('strictQuery', false)

const InitiateMongoServer =  () => {
	mongoose.connect(MONGOURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}).then(() => {
		console.log('connected to mongodb!')
	}).catch(() => {
		console.log('error connecting to db')
	})
}

module.exports = InitiateMongoServer