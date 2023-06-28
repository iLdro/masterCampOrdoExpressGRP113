const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email : {
        type: String,
        required: true,
    },
    password : {
        type: String,
        required: true,
    }
});

const User = mongoose.model('amdmin', userSchema);

module.exports = User;
