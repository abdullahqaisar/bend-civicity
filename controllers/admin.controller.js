/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

require('dotenv').config();

const Admin = require('../models/admin.model');
const User = require('../models/user.model');
const Ride = require('../models/ride.model');

exports.signup = async (req, res) => {
  const { email, password, firstName, lastName } = req.body;

  let admin = await Admin.findOne({ Email: email });
  if (admin) {
    return res.status(400).json({
      message: 'Admin already exists!',
    });
  }

  admin = new Admin({
    Email: email,
    Password: await bcrypt.hash(password, 10),
    FirstName: firstName,
    LastName: lastName,
  });

  admin = await admin.save();
  if (!admin) {
    return res.status(401).json({
      message: 'Error adding an admin!',
    });
  }

  return res.status(201).json({
    message: 'Admin Added!',
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ Email: email });
  if (!admin) {
    return res.status(400).json({ message: 'Admin does not exist!' });
  }

  const isMatch = await bcrypt.compare(password, admin.Password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Incorrect Password!' });
  }

  const payload = { admin: { id: admin._id } };
  const token = await jwt.sign(payload, process.env.JWT_KEY, {
    expiresIn: 10000,
  });

  return res.status(200).json({ token });
};

exports.deleteAdmin = async (req, res) => {
  const { email } = req.body;
  const admin = await Admin.findOneAndDelete({
    Email: email,
  });
  if (!admin) {
    return res.status(400).json({
      message: 'Admin not found!',
    });
  }
  return res.status(200).json({
    message: 'Admin deleted!',
  });
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find();
  if (!users) {
    return res.status(400).json({
      message: 'No users found!',
    });
  }
  return res.status(200).json({
    users,
  });
};

exports.findSingleUser = async (req, res) => {
  const { userId } = req.params.id;
  const user = await User.findOne({ _id: userId });
  if (!user) {
    return res.status(400).json({
      message: 'User not found!',
    });
  }
  return res.status(200).json({
    user,
  });
};

exports.getAllRides = async (req, res) => {
  const rides = await Ride.find();
  if (!rides) {
    return res.status(400).json({
      message: 'No rides found!',
    });
  }
  return res.status(200).json({
    rides,
  });
};

exports.getSingleRide = async (req, res) => {
  const { rideId } = req.params.id;
  const ride = await Ride.findOne({ _id: rideId });
  if (!ride) {
    return res.status(400).json({
      message: 'Ride not found!',
    });
  }
  return res.status(200).json({
    ride,
  });
};
