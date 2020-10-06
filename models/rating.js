const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cetagorySchema = new Schema({
    rating: {
        
        type:String
    },
    description: {
        type: String,
        required:true
    },
    username: {
        type: String,
        required:true
    }
},{timestamps:true})
module.exports=mongoose.model('Rating',cetagorySchema)