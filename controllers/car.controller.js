const Car = require('../models/car.model');
const User = require('../models/user.model');

exports.addCar = async (req, res) => {
  const userId = req.user;

  let user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: 'Error finding user account' });
  }

  const { licensePlateNumber, brand, modelName, modelYear, colour } = req.body;

  let car = new Car({
    licensePlateNumber,
    brand,
    modelName,
    modelYear,
    colour,
  });

  car = await car.save();

  if (!car) {
    return res.status(401).json({ message: 'Error adding car' });
  }

  if (user.userType !== true) {
    user.userType = true;
  }
  user.driverData.cars.push(car.id);
  user = await user.save();

  if (!user) {
    return res.status(500).json({
      message: 'Error adding car!',
    });
  }

  return res.status(201).json({
    message: 'Car Added!',
  });
};

exports.getCars = async (req, res) => {
  const userId = req.user;
  const { carbrand } = req.query;

  if (carbrand !== undefined) {
    // Get cars by brand
    const carBrand = await Car.find({ brand: carbrand });
    if (!carBrand) {
      return res.status(401).json({ message: 'Error getting car brand!' });
    }
    return res.status(200).json({ message: 'Car Brand!', carBrand });
  }
  // Get all cars added by the user
  const user = await User.findById({ _id: userId }).populate('driverData.cars');
  if (!user) {
    return res.status(500).json({ message: 'Error finding Driver' });
  }

  return res.status(200).json({ cars: user.driverData.cars });
};

exports.deleteCar = async (req, res) => {
  const carId = req.params.carid;

  const car = await Car.remove({ _id: carId });
  if (!car) {
    return res.status(500).json({ message: "Can't delete car!" });
  }

  return res.status(201).json({ message: 'Car deleted!' });
};
