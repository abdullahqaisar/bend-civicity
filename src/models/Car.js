const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  CarLicensePlateNumber: {
    type: String,
  },

  CarBrand: {
    type: String,
  },

  CarModelYear: {
    type: Number,
  },

  CarColour: {
    type: String,
  },

  FuelAverage: {
    type: Number,
  },
  
  CarModelName: {
    type: String,
  },

  CarCopyFrontImage: {
    path: String,
    data: Buffer,
    contentType: String,
  },

  CarCopyBackImage: {
    path: String,
    data: Buffer,
    contentType: String,
  },

  IsCarInRide: {
    type: Boolean,
    default: false,
  },
  CarImage: {
    type: String,
    data: Buffer,
    contentType: String,
  },
  Rides: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ride",
  },

});

const Car = mongoose.model("Car", CarSchema);
module.exports = Car;
