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

  Images: {
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

  //false for user, true for driver
  UserType: {
    type: Boolean,
    default: false,
  },

  //0 for not provided, 1 for pending, 2 for verified
  VerificationStatus: {
    CNIC: {
      type: Number,
      default: 0,
    },
    PhoneNumber: {
      type: Number,
      default: 2,
    },
    Email: {
      type: Number,
      default: 0,
    },
    License: {
      type: Number,
      default: 0,
    },
  },

  RidesTaken: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
    },
  ],

  MemberSince: {
    type: Date,
    default: Date.now,
  },

  DriverData: {
    ExperienceLevel: {
      type: String,
    },

    Rides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],

    Cars: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },

        LicensePlateNumber: {
          type: String,
        },

        Brand: {
          type: String,
        },

        ModelYear: {
          type: Number,
        },

        Colour: {
          type: String,
        },

        ModelName: {
          type: String,
        },

        IsCarInRide: {
          type: Boolean,
          default: false,
        },

        Rides: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ride",
        },

        Images: {
          CarImage: {
            type: String,
            data: Buffer,
            contentType: String,
          },
          CopyFrontImage: {
            path: String,
            data: Buffer,
            contentType: String,
          },

          CopyBackImage: {
            path: String,
            data: Buffer,
            contentType: String,
          },
        },
      },
    ],
  },
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
