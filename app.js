const express = require('express');
const mongoose = require('mongoose');
require('./mongo/db.js');
const key = require('./auth/creation/keyGenerator.js');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');

const createUser = require('./dist/createUser.js');
const startUserSession = require('./auth/authSession.js');
const createMed = require('./dist/createMed.js');

const app = express();

app.use(express.json());
app.use(session({
  secret: key,
  resave: false,
  saveUninitialized: true,
}))


app.use(cors({
  origin: (origin, callback) => {
      // Check if the request origin is allowed
      // You can implement your own logic here to validate the origin
      const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const fakeUser = {
  email: 'machin@gmail.com ',
  name: 'machin',
  firstname: 'machin',
  password: 'machin',
  carteVitale: 'machin',
};

app.get('/', (req, res) => {
  res.send(fakeUser);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/create/user', (req, res) => {
  createUser(req, res);
}
);

app.post('/create/med', (req, res) => {
  createMed(req, res);
}
);

app.post('/login/user', (req, res) => {
  const token = startUserSession(req, res);
  localStorage.setItem('token', token);
  res.status(200).send(token);
}
);
