const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  score: {
    type: Number,
    default: 0,
  },
  comment: {
    type: String,
    default: '',
  },
  date: {
    type: Date,
    default: Date.now,
  },

  // 0: Passenger, 1: Driver
  userRole: {
    type: Number,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = mongoose.model('Rating', ratingSchema);
