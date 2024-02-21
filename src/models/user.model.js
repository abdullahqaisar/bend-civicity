const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');

const ValidateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
    validate: [ValidateEmail, 'Please fill a valid email address'],
  },

  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },

  age: {
    type: Number,
  },

  bio: {
    type: String,
    default: '',
  },

  preferences: {
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

  activeRide: {
    type: Boolean,
    default: false,
  },

  activeRideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ride',
  },

  ratings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Rating',
    },
  ],

  // false for user, true for driver
  userType: {
    type: Boolean,
    default: false,
  },

  images: {
    Profile: {
      type: String,
    },
    CnicFront: {
      type: String,
    },

    CnicBack: {
      type: String,
    },
    License: {
      type: String,
    },
  },

  // 0 for not provided, 1 for pending, 2 for verified
  verificationStatus: {
    cnic: {
      type: Number,
      default: 0,
    },
    phoneNumber: {
      type: Number,
      default: 2,
    },
    email: {
      type: Number,
      default: 0,
    },
    license: {
      type: Number,
      default: 0,
    },
  },

  ridesTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ride',
    },
  ],

  memberSince: {
    type: Date,
    default: Date.now,
  },

  driverData: {
    experienceLevel: {
      type: String,
    },

    rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ride',
      },
    ],

    cars: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Car',
      },
    ],
  },
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
