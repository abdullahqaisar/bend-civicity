const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const CarSchema = new mongoose.Schema({
  CarLiscensePlateNumber: {
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

  CarModelName: {
    type: String,
  },

  LiscenseImage: {
    path: String,
    data: Buffer,
    contentType: String,
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
  }
});

const Car = mongoose.model("UserCar", CarSchema);
module.exports = Car;
