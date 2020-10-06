const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const buydataSchema = new Schema({
    accountname: {
        type: String
    },
    number: {
        type: String
    },


});

module.exports = mongoose.model('Number', buydataSchema);
