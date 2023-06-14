const mongoose = require('mongoose');  

const medsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    firstname: {
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
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: false,
    },
    password: {
        type: String,
        required: false,
    },
    profINSEE: {
        type: String,
        required: true,
    },
    RPPS : {
        type: String,
        required: true,
    },
    signature : {
        type: String,
        required: true,
    },
    validate : {
        type: Boolean,
        required: true,
    },
});

const Meds = mongoose.model('meds', medsSchema);

module.exports = Meds;