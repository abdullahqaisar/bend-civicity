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
  },

  Completed: {
    type: Boolean,
    default: false,
  },

  StartTime: {
    type: String,
  },

  Driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
