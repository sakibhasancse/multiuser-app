const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const selldataSchema = new Schema({
    uscountryname: {
        type: String,
    },
    usrate: {
        type: Number,
    },

    bdcountryname: {
        type: String,
    },
    bdrate: {
        type: Number,
    }


});

module.exports = mongoose.model('Sell', selldataSchema);
