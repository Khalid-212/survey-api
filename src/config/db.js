const mongoose = require('mongoose')

// const MONGOURI = 'mongodb+srv://khalidibr212:FnUKbWiUQPJIRnm8@menuapp-shard-0/test?ssl=true'
const MONGOURI = 'mongodb+srv://khalidibr212:FnUKbWiUQPJIRnm8@menuapp.5gpnyta.mongodb.net/?retryWrites=true&w=majority'

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