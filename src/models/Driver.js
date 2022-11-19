const mongoose = require("mongoose");

const DriverSchema = new mongoose.Schema({
  UserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  ExperienceLevel: {
    type: String,
    default: "Beginner",
  },

  Cars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
  ],

  LicenseImage: {
    type: String,
  },

  LicenseVerifiedStatus: {
    type: String,
    default: "Not Verified",
  },
});

const User = mongoose.model("Driver", DriverSchema);
module.exports = User;
