const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const user = require('./routes/user') //new addition
const survey = require('./routes/survey') //new addition
const entry = require('./routes/entry') //new addition
const InitiateMongoServer = require('./config/db')

const app = express()
app.use(cors())

// PORT
const PORT = process.env.PORT || 5000

// Middleware
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ message: 'API Working' })
})

app.use('/users', user)
app.use('/surveys', survey)
app.use('/entries', entry)

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`)
  InitiateMongoServer()
})
