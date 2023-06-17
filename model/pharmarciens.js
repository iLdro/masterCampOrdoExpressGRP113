const mongoose = require('mongoose');

const pharmarcienSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    firstname: {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    numberStreet: {
        type: String,
        required: true,
    },
    street: {
        type: String,
        required: true,
    },
    city : {
        type: String,
        required: true,
    },
    postalCode: {
        type: String,
        required: true,
    },
    phamarcieName : {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    RPPS : {
        type: String,
        required: true,
    },
    validation : {
        type: Boolean,
        required: true,
    },
});

const Pharmarcien = mongoose.model('pharmarcien', pharmarcienSchema);

module.exports = Pharmarcien;