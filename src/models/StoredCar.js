const mongoose = require("mongoose");

const CarModel = new mongoose.Schema({
  CarBrand: {
    type: String,
  },
  CarModelName: {
    type: String,
  },
  CarModelYear: {
    type: String,
  },
});

const AllCar = mongoose.model("StoredCar", CarModel);
module.exports = AllCar;
