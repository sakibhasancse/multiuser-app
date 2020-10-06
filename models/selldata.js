const { isObject, isObjectLike } = require('lodash');
const { ObjectID, ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const randomize = require('randomatic')

const dataSchema = new Schema({

  // _id: {
  //   type: String,
  //   default: randomize('A0', 5)
  // },
  condition: {
    type: String,
    required: true,
    default:'selling'
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
  usdsend: {
    type: String,
    required: true,
  },
  bdcardName: {
    type: String,
    required: true,
  },
  tkrecive: {
    type: String,
    required: true,

  },
  usdcardname: {
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

module.exports = mongoose.model('selldata', dataSchema);
