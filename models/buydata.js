const { isObject, isObjectLike } = require('lodash');
const { ObjectID, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const randomize = require('randomatic')

const dataSchema = new Schema({

  condition: {
    type: String,
    default:'buying'
  },
  status: {
    type: String,
    required: true,
    default: 'pandding'
  },
  ordercon: {
    type: Boolean,
    required: true,
    default: true
  },
  rat: {
    type:Boolean
  
},
  reciveusd: {
    type: String,
    required: true,
  },
  reciveusdName: {
    type: String,
    required: true,
  },
  senttk: {
    type: String,
    required: true,

  },
  sentaccountname: {
    type: String,
    required: true,
  },
  sentnumber: {
    type: String
  },
  senderphone: {
    type: String
  }, reciveemail: {
    type: String
  }, personalemail: {
    type: String
  },
  personalphone: {
    type: String
  },
  description: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }



}, { timestamps: true });

module.exports = mongoose.model('buydata', dataSchema);
