const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema({
  Score: {
    type: Number,
    default: 0,
  },
  Comment: {
    type: String,
    default: "",
  },
  Date: {
    type: Date,
    default: Date.now,
  },

  // 0: Passenger, 1: Driver
  UserRole: {
    type: Number,
  },
  
  User: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Rating", ratingSchema);
