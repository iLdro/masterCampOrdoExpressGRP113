const mongoose = require('mongoose');

const ordonnanceSchema = new mongoose.Schema({
    medecin_id: {
        type: String,
        required: true,
    },
    client_id: {
        type: String,
        required: true,
    },
    medicaments: {
        type: Array,
        required: true,
    },
    pharmacien_id: {
        type: String,
        required: false,
    },
    dateDeCréation: {
        type: Date,
        required: true,
    },
    expired: {
        type: Boolean,
        required: true,
    }
});

const Ordonnance = mongoose.model('ordonnances', ordonnanceSchema);

module.exports = Ordonnance;
