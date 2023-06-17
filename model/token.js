const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
    },
    id : {
        type: String,
        required: true,
    },
    type : {
        type: String,
        required: true,
    },
    date : {
        type: Date,
        required: true,
    },
});

const Token = mongoose.model('token', tokenSchema);

module.exports = Token;
