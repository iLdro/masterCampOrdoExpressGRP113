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
