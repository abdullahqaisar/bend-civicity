const mongoose = require("mongoose");

const RideSchema = new mongoose.Schema({
  StartLat: {
    type: Number,
  },
  StartLong: {
    type: Number,
  },
  DropLat: {
    type: Number,
  },
  DropLong: {
    type: Number,
  },
  StartLocation: {
    type: String,
    required: true,
  },

  DropLocation: {
    type: String,
    required: true,
  },

  TotalSeats: {
    type: Number,
    required: true,
  },

  AvailableSeats: {
    type: Number,
  },

  PricePerSeat: {
    type: Number,
    required: true,
  },

  PublishingTime: {
    type: Date,
    default: Date.now,
  },

  RideStatus: {
    type: Boolean,
    default: false,
  }, // false means not started, true means started

  Completed: {
    type: Boolean,
    default: false,
  }, // false means not completed, true means completed

  Cancelled: {
    type: Boolean,
    default: false,
  }, // false means not cancelled, true means cancelled

  StartTime: {
    type: String,
  },

  Driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  Rating: {
    type: Number,
  },
  Car: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Car",
  },

  Passengers: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      Seats: {
        type: Number,
      },
    },
  ],
});

const Ride = mongoose.model("Ride", RideSchema);

module.exports = Ride;
