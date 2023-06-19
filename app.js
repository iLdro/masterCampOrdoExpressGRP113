require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
require('./mongo/db.js');
const key = require('./auth/creation/keyGenerator.js');
const session = require('express-session');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoDBStore = require('connect-mongodb-session')(session);

const createUser = require('./dist/userFonction.js');
const {startUserSession, startMedSession, startPharmacianSession} = require('./auth/authSession.js');
const {createMed, getPendingMed, validateMed, getMedById, declineMed} = require('./dist/medFonction.js');
const {createPharmacian, getPendingPharmacian, validatePharmacien, getPendingPharmacien, declinePharmarcien} = require('./dist/pharmacianFonction.js');

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
      const allowedOrigins = ['http://localhost:8081', 'http://127.0.0.1:8081', 'http://10.3.219.87:8081','http://localhost:8080'];
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

const store = new MongoDBStore({
  uri: process.env.MONGO,
  collection: 'session',
  expires: 1000 * 60 * 60 * 24 * 7,
});

store.on('error', function (error) {
  console.log('Error creating session', error);
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: { secure: false },
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  })
);
app.get('/', (req, res, next) => {
  res.send(fakeUser);
  next();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.post('/create/user', (req, res) => {
  createUser(req, res);
  console.log("user body",req.body);
}
);

app.post('/create/med', (req, res) => {
  createMed(req, res);
}
);

app.post('/create/pharmacien', (req, res) => {
  createPharmacian(req, res);
}
);


app.post('/login/user', (req, res) => {
  startUserSession(req, res)
    .then(({ token, res }) => {
      console.log("user",token);
    })
    .catch(error => {
      console.log(error);
      res.status(500).send('Internal server error');
    });
});

app.get('/admin/pendingMed', (req, res) => {
  const pendingMed = getPendingMed(req, res);
}
);

app.get('/admin/pendingPharmacien', (req, res) => {
  const pendingPharmacien = getPendingPharmacien(req, res);
}
);


app.post('/admin/acceptMed', (req, res) => {
  validateMed(req, res);  
}
);


app.post('/admin/acceptPharmacien', (req, res) => {
  validatePharmacien(req, res);  
}
);

app.post('/admin/declineMed', (req, res) => {
  declineMed(req, res);
}
);

app.post('/admin/declinePharmacien', (req, res) => {
  declinePharmarcien(req, res);
}
);



app.get('/med/:id', (req, res) => {
  getMedById(req, res);
}
);
