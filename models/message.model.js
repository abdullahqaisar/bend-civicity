const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },

  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },

  sentAt: {
    type: Date,
    default: Date.now,
  },
});
