const express = require('express');
const mongoose = require('mongoose');
require('./mongo/db.js');
const createUser = require('./dist/createUser.js');

const app = express();

app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

app.post('/users',(req, res) => {
    createUser(req, res);
    }
);