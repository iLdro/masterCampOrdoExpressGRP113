const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const docSchema = new Schema({
    image : {
        type: String,
        required: true,
    }
});

const Doc = mongoose.model('docs', docSchema);

module.exports = Doc;
