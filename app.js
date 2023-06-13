const express = require('express');
const mongoose = require('mongoose');
require('./mongo/db.js');
const createUser = require('./dist/createUser.js');
const key = require('./auth/creation/keyGenerator.js');
const startUserSession = require('./auth/authSession.js');
const session = require('express-session');


const app = express();

app.use(express.json());
app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: true,
}))

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.post('/users', (req, res) => {
  createUser(req, res);
}
);

app.post('/login/user', (req, res) => {
  const token = startUserSession(req, res);
  localStorage.setItem('token', token);
  res.status(200).send(token);
}
);
