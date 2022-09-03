const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  FirstName: {
    type: String,
    required: true,
  },

  LastName: {
    type: String,
    required: true,
  },

  Email: {
    type: String,
    required: true,
    unique: true,
  },

  PhoneNumber: {
    type: Number,
    // required: true,
    unique: true,
  },

  Driver: {
    type: Boolean,
    default: false,
  },

  Cars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
  ],

  Bio: {
    type: String,
  },

  ActiveRide: {
    type: Boolean,
    default: false,
  },

  CNICFrontImage: {
    type: String,
  },

  CNICBackImage: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
