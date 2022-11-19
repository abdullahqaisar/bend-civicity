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
    required: true,
    unique: true,
  },

  Age: {
    type: Number,
  },

  Bio: {
    type: String,
    default: "",
  },

  Preferences: {
    smoking: {
      type: Number,
    },
    music: {
      type: Number,
    },
    pets: {
      type: Number,
    },
  },

  ActiveRide: {
    type: Boolean,
    default: false,
  },

  ActiveRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
  },

  Ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Rating",
    },
  ],

  ProfileImage: {
    type: String,
    default: "",
  },

  //false for user, true for driver
  UserType: {
    type: boolean,
    default: false,
  },

  //0 for not provided, 1 for pending, 2 for verified
  VerificationStatus: {
    CNIC: {
      type: String,
      default: "False",
    },
    PhoneNumber: {
      type: String,
      default: "False",
    },
    Email: {
      type: String,
      default: "False",
    },
  },

  CnicFront: {
    type: String,
  },

  CnicBack: {
    type: String,
  },

  Rides: {
    AsPassenger: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
    AsDriver: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
