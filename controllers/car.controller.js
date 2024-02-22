const Car = require('../models/stored-car.model');

exports.addCar = async (req, res) => {
  const newCar = new Car(req.body);

  const car = await newCar.save();
  if (!car) {
    return res.status(401).json({
      message: 'Error adding a car!',
    });
  }

  return res.status(201).json({
    message: 'Car Added!',
  });
};

exports.getCarBrands = async (req, res) => {
  const carBrands = await Car.find().distinct('CarBrand');
  if (!carBrands) {
    return res.status(401).json({
      message: 'Error getting car brands!',
    });
  }

  return res.status(201).send(carBrands);
};

exports.getCarsByBrand = async (req, res) => {
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
};
