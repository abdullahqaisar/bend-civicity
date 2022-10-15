const mongoose = require("mongoose");

const ValidateEmail = (email) => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

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
    validate: [ValidateEmail, "Please fill a valid email address"],
  },

  PhoneNumber: {
    type: String,
    // required: true,
    unique: true,
  },

  Cars: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
    },
  ],

  Bio: {
    type: String,
    default: "",
  },

  Rating: {
    type: Number,
    default: 0,
  },

  ActiveRide: {
    type: Boolean,
    default: false,
  },


  ProfileImage: {
    type: String,
    default: "",
  },

  // LicenseImage: {
  //   type: String,
  // },

  LicenseVerifiedStatus: {
    type: String,
    default: "False",
  },

  CNICVerifiedStatus: {
    type: String,
    default: "False",
  },

  EmailVerifiedStatus: {
    type: String,
    default: "False",
  },

  CnicFront: {
    type: String,
  },

  CnicBack: {
    type: String,
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
