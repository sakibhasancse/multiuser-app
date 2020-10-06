const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const aboutSchema = new Schema({

    title: {
        required: true,
        type: String
    }
})
module.exports = mongoose.model('Privasy', aboutSchema)