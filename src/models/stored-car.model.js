const mongoose = require("mongoose");

const CarModel = new mongoose.Schema({
  brand: {
    type: String,
  },
  modelName: {
    type: String,
  },
  modelYear: {
    type: String,
  },
});

const AllCar = mongoose.model("StoredCar", CarModel);
module.exports = AllCar;
