const express = require('express');
const bodyParser = require('body-parser');
const user = require('./routes/user'); //new addition
const InitiateMongoServer = require('./config/db');


const app = express();

// PORT
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Working' });
});

app.use('/user', user);

app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
  InitiateMongoServer();
});
