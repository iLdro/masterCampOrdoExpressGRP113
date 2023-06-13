const mongoose = require('mongoose');
const mongoP = require('../private/mongoPkey.js');

console.log('mongoP: ', mongoP);
mongoose.connect(mongoP, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

