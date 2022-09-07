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

  Rating: {
    type: Number,
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
