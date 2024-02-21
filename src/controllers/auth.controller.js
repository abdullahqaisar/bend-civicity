/* eslint-disable no-underscore-dangle */
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

require('dotenv').config();

const { storeImage } = require('../helpers/storeImageToServer');

exports.signup = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
      cnicBack: base64CnicBack = undefined,
      cnicFront: base64CnicFront = undefined,
    } = req.body;

    const userData = {
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
    };

    const newUser = await User.create({ ...userData });

    if (base64CnicBack !== undefined && base64CnicFront !== undefined) {
      const directory = `uploads/images/${phoneNumber}/cnic/`;
      const backImgName = 'CnicBack.png';
      const frontImgName = 'CnicFront.png';

      const cnicBackImage = `data:image/png;base64,${base64CnicBack}`;
      const cnicFrontImage = `data:image/png;base64,${base64CnicFront}`;

      newUser.CnicFront = await storeImage(
        frontImgName,
        cnicFrontImage,
        directory,
      );
      newUser.CnicBack = await storeImage(
        backImgName,
        cnicBackImage,
        directory,
      );
    }

    await newUser.save();

    if (!newUser) {
      return res.status(500).json({ message: 'Failed to save user.' });
    }

    const token = jwt.sign(
      {
        phoneNumber,
        userId: newUser._id,
      },
      process.env.JWT_KEY,
    );

    return res
      .status(201)
      .json({ message: 'Account successfully created!', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber }).populate('Ratings');

    if (!user) {
      return res
        .status(401)
        .json({ message: 'Account does not exist! Please proceed to signup' });
    }

    const sanitizedUser = {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      age: user.age,
      ratings: user.ratings,
      userType: user.userType,
      verificationStatus: user.verificationStatus,
      ridesTaken: user.ridesTaken,
    };

    const token = await jwt.sign(
      {
        phoneNumber,
        userId: user._id,
      },
      process.env.JWT_KEY,
    );

    return res.status(201).json({
      message: 'Login successful!',
      token,
      user: sanitizedUser,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
