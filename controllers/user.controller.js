const User = require('../models/user.model');
const Ride = require('../models/ride.model');

const { storeImage } = require('../helpers/storeImageToServer');

exports.getUser = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(401).json({ message: 'Error finding user account' });
  }
  return res.status(201).send(user);
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

// get average rating and all ratings
exports.getDriverRating = async (req, res) => {
  const userId = req.user;

  const user = await User.findById(userId).populate({
    path: 'ratings',
    match: { userRole: 1 },
  });
  if (!user) {
    throw new Error('User not found');
  }

  const driverRatings = user.ratings.filter((rating) => rating.userRole === 1);

  if (driverRatings.length === 0) {
    return res.status(200).json({ message: 'No driver ratings found' });
  }

  const averageRating =
    driverRatings.reduce((sum, rating) => sum + rating.Score, 0) /
    driverRatings.length;

  return res.status(200).json({ averageRating, ratings: driverRatings });
};

exports.getRidesByUser = async (req, res) => {
  const userId = req.params.id;
  const { published } = req.query;

  const filter = { driver: userId };

  if (published !== undefined) {
    filter.published = published;
  }

  const data = await Ride.find(filter);

  if (!data || data.length === 0) {
    return res.status(404).json({
      message: 'No rides found!',
    });
  }

  return res.status(200).send(data);
};

exports.getRides = async (req, res) => {
  const userId = req.user;
  const { status } = req.query;

  const filter = { Passengers: { $elemMatch: { _id: userId } } };

  if (status !== undefined) {
    filter.Status = parseInt(status, 10);
  }

  const data = await Ride.find(filter);

  if (!data || data.length === 0) {
    return res.status(404).json({
      message: 'No rides found!',
    });
  }

  return res.status(200).send(data);
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

exports.updateUser = async (req, res) => {
  const userId = req.user;
  const { bio, smoking, music, pets } = req.query;

  let updateData;

  if (bio !== undefined) {
    updateData = { bio };
  } else if (
    smoking !== undefined ||
    music !== undefined ||
    pets !== undefined
  ) {
    updateData = {
      ...(smoking !== undefined || music !== undefined || pets !== undefined
        ? { preferences: { smoking, music, pets } }
        : {}),
    };
  } else {
    return res.status(400).json({
      message: 'Invalid query parameters!',
    });
  }

  const user = await User.findOneAndUpdate({ _id: userId }, updateData);

  if (!user) {
    return res.status(500).json({
      message: 'An Error occurred while updating profile!',
    });
  }

  return res.status(201).json({
    message: 'Profile updated successfully!',
  });
};
