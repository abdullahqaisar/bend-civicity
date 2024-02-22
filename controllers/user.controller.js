const User = require('../models/user.model');
const Ride = require('../models/ride.model');
const Car = require('../models/car.model');

const { storeImage } = require('../helpers/storeImageToServer');

exports.getUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: 'Error finding user account' });
  }
  return res.status(201).send(user);
};

exports.uploadProfilePicture = async (req, res) => {
  const userId = req.user;
  const buffer = req.body.image;

  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(201).json({ message: 'Error finding user account' });
  }

  const { phoneNumber } = user;
  const directory = `uploads/images/${phoneNumber}/profilepicture/`;
  const imagePath = storeImage('profilepicture.png', buffer, directory);

  user.ProfilePicture = imagePath;
  await user.save();

  return res.status(201).json({ message: 'Profile Picture Uploaded' });
};

exports.verifyLicenseImage = async (req, res) => {
  const userId = req.user;

  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: 'Error finding user account' });
  }

  const licenseImagebuffer = req.body.image;
  const phoneNumber = user.PhoneNumber;
  const directory = `uploads/images/${phoneNumber}/license/`;
  const imagePath = storeImage('license.png', licenseImagebuffer, directory);
  user.LicenseImage = imagePath;
  user.LicenseVerifiedStatus = 'Pending';
  await user.save();

  return res.status(201).json({ message: 'License Image Uploaded' });
};

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
  user.driverData.cars.push(car._id);
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

exports.getAllAddedCar = async (req, res) => {
  const userId = req.user;

  // only select cars from user
  const user = await User.findById({ _id: userId }).populate('driverData.cars');
  if (!user) {
    return res.status(500).json({ message: 'Error finding Driver' });
  }

  return res.status(201).json({ cars: user.driverData.cars });
};

// get average rating and all ratings
exports.getDriverRating = async (req, res) => {
  const userId = req.user;

  const user = await User.findById({ _id: userId }).populate({
    path: 'ratings',
    match: { userRole: 1 },
  });
  if (!user) {
    return res.status(401).json({ message: 'Error finding user account' });
  }

  const count = Object.keys(user.ratings).length;
  let sum = 0;

  for (let i = 0; i < count; i++) {
    sum += user.ratings[i].Score;
  }
  const averageRating = sum / count;

  return res.status(201).json({ averageRating, ratings: user.ratings });
};

exports.getPublishedRides = async (req, res) => {
  const userId = req.params.id;
  const data = await Ride.find({ driver: userId });
  if (!data) {
    return res.status(201).json({
      message: 'No rides found!',
    });
  }

  return res.status(201).send(data);
};

// find all rides that are completed and have the user as a passenger
exports.getCompletedRides = async (req, res) => {
  const userId = req.user;

  const data = await Ride.find({
    $and: [{ Status: 2 }, { Passengers: { $elemMatch: { _id: userId } } }],
  });
  if (!data) {
    return res.status(400).json({
      message: 'No rides found!',
    });
  }

  return res.status(201).send(data);
};

exports.addBio = async (req, res) => {
  const { bio } = req.body;
  const userId = req.user;
  const user = await User.findOneAndUpdate({ _id: userId }, { bio });
  if (!user) {
    return res.status(400).json({
      message: 'An Error occoured while adding bio!',
    });
  }

  return res.status(201).json({
    message: 'Bio Added!',
  });
};

exports.addPreferences = async (req, res) => {
  const userId = req.user;
  const { smoking, music, pets } = req.body;
  const user = await User.findOneAndUpdate(
    { _id: userId },
    {
      preferences: {
        smoking,
        music,
        pets,
      },
    },
  );
  if (!user) {
    return res.status(500).json({
      message: 'An Error occoured while adding preferences!',
    });
  }

  return res.status(201).json({
    message: 'Preferences Added!',
  });
};

exports.deleteCar = async (req, res) => {
  const carId = req.params.carid;

  const car = await Car.remove({ _id: carId });
  if (!car) {
    return res.status(500).json({ message: "Can't delete car!" });
  }
  return res.status(201).json({ message: 'Car deleted!' });
};
