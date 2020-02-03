const mongoose = require('mongoose')

const MONGOURI = 'mongodb+srv://admin:admin@devcluster-ceb5z.mongodb.net/surveyapp?retryWrites=true&w=majority'

const InitiateMongoServer = () => {
	mongoose.connect(MONGOURI, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	}).then(() => {
		console.log('connected to mongodb!')
	}).catch(() => {
		console.log('error connecting to db')
	})
}

module.exports = InitiateMongoServer
