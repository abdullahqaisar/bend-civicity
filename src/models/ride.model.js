const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
  start: {
    latitide: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    city: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },
  },

  end: {
    latitide: {
      type: Number,
    },

    longitude: {
      type: Number,
    },

    city: {
      type: String,
    },

    location: {
      type: String,
      required: true,
    },
  },

  totalDistance: {
    type: Number,
  },

  totalSeats: {
    type: Number,
    required: true,
  },

  availableSeats: {
    type: Number,
  },

  pricePerSeat: {
    type: Number,
    required: true,
  },

  publishingTime: {
    type: Date,
    default: Date.now,
  },

  startTime: {
    type: String,
  },

  // 0: Not Started, 1: Started, 2: Completed, 3: Cancelled
  status: {
    type: Number,
    default: 0,
  },

  maxLuggage: {
    type: Number,
  },

  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "car.model",
  },

  passengers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user.model",
      },
      seats: {
        type: Number,
      },
    },
  ],

  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "rating.model",
  },

  offers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },

      price: {
        type: Number,
        required: true,
      },

      seats: {
        type: Number,
        required: true,
      },

      offerStatus: {
        type: String,
        default: "Pending",
      },

      offeredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Ride = mongoose.model("Ride", RideSchema);

module.exports = Ride;
