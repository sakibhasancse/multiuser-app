const mongoose = require('mongoose');
const jwt =require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required:true
  },
  
  phone: {
    type: String,
    required:true
  },
  address: {
    type: String,
    required:true
  },
  zip: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
  
  
});
userSchema.methods.genaretJsonAuth = function () {
  const token = jwt.sign({ id: this._id }, 'secretkey', { expiresIn: '4hr' })
  return token;
}


module.exports = mongoose.model('User', userSchema);

