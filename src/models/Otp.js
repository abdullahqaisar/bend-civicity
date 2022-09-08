const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    PhoneNumber: {
      type: String,
    },
    Otp: {
      type: String,
    },
    CreatedAt: {
      type: Date,
      default: Date.now,
      index: { expires: 300 },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Otp", otpSchema);
