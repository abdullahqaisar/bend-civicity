const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  Message: {
    type: String,
    required: true,
  },

  From: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  To: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  SentAt: {
    type: Date,
    default: Date.now,
  },
});
