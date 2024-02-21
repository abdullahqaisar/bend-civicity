const Car = require('../models/stored-car.model');

exports.addCar = async (req, res) => {
  try {
    const { brand, modelName, modelYear } = req.body;
    const newCar = new Car({
      brand,
      modelName,
      modelYear,
    });

    debug(newCar);
    car = await newCar.save();
    if (!car) {
      return res.status(401).json({
        message: 'Error adding a car!',
      });
    }
    return res.status(201).json({
      message: 'Car Added!',
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCarBrands = async (req, res) => {
  try {
    debug('Get Car Brands');
    const carBrands = await Car.find().distinct('CarBrand');
    if (!carBrands) {
      return res.status(401).json({
        message: 'Error getting car brands!',
      });
    }
    debug(carBrands);
    return res.status(201).send(carBrands);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getCarsByBrand = async (req, res) => {
  try {
    const brand = req.params.carbrand;
    const carBrand = await Car.find({
      brand,
    });
    if (!carBrand) {
      return res.status(401).json({
        message: 'Error getting car brand!',
      });
    }

    return res.status(201).json({
      message: 'Car Brand!',
      carBrand,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
