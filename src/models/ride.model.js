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
    ref: "Car",
  },

  passengers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      seats: {
        type: Number,
      },
    },
  ],

  rating: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Rating",
  },

  offers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
      },

      Price: {
        type: Number,
        required: true,
      },

      Seats: {
        type: Number,
        required: true,
      },

      OfferStatus: {
        type: String,
        default: "Pending",
      },

      OfferedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Ride = mongoose.model("Ride", RideSchema);

module.exports = Ride;
