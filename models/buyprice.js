const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buydataSchema = new Schema({
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

module.exports = mongoose.model('Buyprice', buydataSchema);
