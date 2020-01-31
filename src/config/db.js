const mongoose = require('mongoose');

const MONGOURI = 'mongodb+srv://admin:admin@devcluster-ceb5z.mongodb.net/surveyapp?retryWrites=true&w=majority';

const InitiateMongoServer = () => {
  mongoose.connect(MONGOURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('connected to mongodb!')
  }).catch((err) => {
    console.log('err connecting to db')
    // console.log(err)
  })
};

module.exports = InitiateMongoServer;
