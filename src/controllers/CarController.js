const UserCar = require("../models/Car");
const Car = require("../models/Car");



exports.addCar = async (req, res) => {
  try {
    const { carBrand, carModelName, carModelYear } = req.body;
    const newCar = new Car({
      CarBrand: carBrand,
      CarModelName: carModelName,
      CarModelYear: carModelYear,
    });

    console.log(newCar);
    car = await newCar.save();
    if (!car) {
      return res.status(401).json({
        message: "Error adding a car!",
      });
    }
    return res.status(201).json({
      message: "Car Added!",
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCarBrands = async (req, res) => {
  try {
    console.log("Get Car Brands");
    const carBrands = await Car.find().distinct("CarBrand");
    if (!carBrands) {
      return res.status(401).json({
        message: "Error getting car brands!",
      });
    }
    console.log(carBrands);
    return res.status(201).send(carBrands);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCarsByBrand = async (req, res) => {
  try {
    const brand = req.params.carbrand;
    const carBrand = await Car.find({
      CarBrand: brand,
    });
    if (!carBrand) {
      return res.status(401).json({
        message: "Error getting car brand!",
      });
    }

    return res.status(201).json({
      message: "Car Brand!",
      carBrand: carBrand,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
