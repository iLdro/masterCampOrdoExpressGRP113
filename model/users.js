const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  carteVitale: {
    type: String,
    required: false,
    unique: true,
  },
});

const User = mongoose.model('users', userSchema);

module.exports = User;