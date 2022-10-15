const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

require("dotenv").config();

const Admin = require("../models/Admin");
const User = require("../models/User");
const Ride = require("../models/Ride");

const convertImage = require("../helpers/convertImageToBase64").convertImage;

exports.image = async (req, res) => {
  try {
    const path = "uploads/images/03343046353/cnic/CnicBack.png";
    let buffer = await convertImage(path);
    buffer = "data:image/png;base64," + i;
    return res.status(200).json({
      image: buffer,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.signup = async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    let admin = await Admin.findOne({ Email: email });
    if (admin) {
      return res.status(400).json({
        message: "Admin already exists!",
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
        message: "Error adding an admin!",
      });
    }
    return res.status(201).json({
      message: "Admin Added!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    let admin = await Admin.findOne({ Email: email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin does not exist!",
      });
    }
    const isMatch = await bcrypt.compare(password, admin.Password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Incorrect Password!",
      });
    }
    const payload = {
      admin: {
        id: admin._id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_KEY,
      {
        expiresIn: 10000,
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
        });
      }
    );
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.deleteAdmin = async (req, res) => {
  try {
    const { email } = req.body;
    const admin = await Admin.findOneAndDelete({ Email: email });
    if (!admin) {
      return res.status(400).json({
        message: "Admin not found!",
      });
    }
    return res.status(200).json({
      message: "Admin deleted!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (!users) {
      return res.status(400).json({
        message: "No users found!",
      });
    }
    return res.status(200).json({
      users,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.findSingleUser = async (req, res) => {
  try {
    const { userId } = req.params.id;
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({
        message: "User not found!",
      });
    }
    return res.status(200).json({
      user,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.getAllRides = async (req, res) => {
  try {
    const rides = await Ride.find();
    if (!rides) {
      return res.status(400).json({
        message: "No rides found!",
      });
    }
    return res.status(200).json({
      rides,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.getSingleRide = async (req, res) => {
  try {
    const { rideId } = req.params.id;
    const ride = await Ride.findOne({ _id: rideId });
    if (!ride) {
      return res.status(400).json({
        message: "Ride not found!",
      });
    }
    return res.status(200).json({
      ride,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};
