const express = require("express");
const moongose = require("mongoose");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator"); //Generate OTP
var fs = require("fs");
const path = require("path");
var fs = require("fs-extra");
// import { getAuth, signInWithPhoneNumber } from "firebase/auth";

require("dotenv").config();

const User = require("../models/User");
const Otp = require("../models/Otp");

const SID = "AC2a212051632cb6bb0f0644deb2a7b25b";
const AUTH_TOKEN = "e080facc80d9285e2ff476a9eeec38af";

const twilio = require("twilio")(SID, AUTH_TOKEN);

// exports.image = async (req, res) => {
//   let base64Image = img.split(";base64,").pop();
//   fs.writeFile(
//     "image.png",
//     base64Image,
//     { encoding: "base64" },
//     function (err) {
//       console.log("File created");
//     }
//   );
// };

const saveImageToLocal = (phoneNumber, fileName, buffer) => {
  const trimBuffer = Buffer.from(buffer.split("base64,")[1], "base64");
  let DIR = "uploads/images/" + phoneNumber + "/cnic/";
  fileurl = path.join(DIR, fileName);
  fs.outputFile(fileurl, trimBuffer, { encoding: "base64" }, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(fileName + " uploaded");
    }
  });
  const url = String(fileurl);
  return url;
};

exports.signup = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber} =
      req.body;
      console.log(req.body);
    const existingUser = await User.findOne({ Email: email });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with same email already exists!" });
    }
    const newUser = new User({
      _id: new moongose.Types.ObjectId(),
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      PhoneNumber: phoneNumber,
    });

    // const backImgName = "CnicBack.png";
    // const frontImgName = "CnicFront.png";

    // if (cnicBack !== undefined && cnicFront !== undefined) {
    //   const backImgPath = await saveImageToLocal(
    //     phoneNumber,
    //     backImgName,
    //     cnicBack
    //   );
    //   const frontImgPath = await saveImageToLocal(
    //     phoneNumber,
    //     frontImgName,
    //     cnicFront
    //   );
    //   newUser.CNICFrontImage = frontImgPath;
    //   newUser.CNICBackImage = backImgPath;
    // }
    
    console.log(newUser);
    const userCreated = await newUser.save();
    if (!userCreated) {
      return res.status(600).json({ msg: "User not saved!" });
    }
    const token = await jwt.sign(
      {
        phoneNumber: phoneNumber,
        userId: userCreated._id,
      },
      process.env.JWT_KEY
    );
    return res.status(201).json({
      message: "Account successfully created!",
      token: token,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
};

exports.getOtp = async (req, res) => {
  try {
    const phoneNumber = req.body.phoneNumber;
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // const message = await twilio.messages
    //   .create({
    //     from: "+16693222805",
    //     to: "+92" + phoneNumber,
    //     body: "Verification code for CiviCity is " + otp,
    //   })
    //   .then((res) => console.log("message sent"))
    //   .catch((err) => console.log(err));

    // const otp = new Otp({
    //   PhoneNumber: phoneNumber,
    //   Otp: otp,
    // });

    let otpObj = new Otp({
      PhoneNumber: phoneNumber,
      Otp: "123456",
    });

    otpObj = await otpObj.save();
    if (!otpObj) {
      console.log("OTP not sent");
      return res.status(400).json({ msg: "Otp not saved!" });
    }
    console.log(otpObj);
    console.log("OTP sent");
    return res.status(201).json({
      message: "OTP sent!",
    });
  } catch (err) {
    console.log("OTP not sent!");
    res.status(500).json({
      error: err,
    });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { otp, phoneNumber } = req.body;
    const verifyOtp = await Otp.find({
      $and: [{ Otp: otp }, { PhoneNumber: phoneNumber }],
    });
    if (verifyOtp < 1) {
      return res.status(500).json({
        message: "Incorrect OTP!",
      });
    }

    const existingUser = await User.findOne({ PhoneNumber: phoneNumber });
    if (existingUser) {
      const user = await User.find({ PhoneNumber: phoneNumber });
      if (user.length < 1) {
        return res.status(401).json({
          message: "Login failed!",
        });
      } else {
        const token = jwt.sign(
          {
            phoneNumber: user[0].PhoneNumber,
            userId: user[0]._id,
          },
          process.env.JWT_KEY
        );
        res.status(307).json({
          message: "Login successful!",
          token: token,
          user: user[0],
        });
      }
    } else {
      return res.status(200).json({
        message: "Please continue registration!",
      });
    }
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// exports.signUpFirebase = async (req, res) => {
//   const phoneNumber = "+923100868589";
//   const appVerifier = window.recaptchaVerifier;

//   const auth = getAuth();
//   signInWithPhoneNumber(auth, phoneNumber, appVerifier)
//     .then((confirmationResult) => {
//       console.log("OTP Verified");
//       window.confirmationResult = confirmationResult;
//       // ...
//     })
//     .catch((error) => {
//       // Error; SMS not sent
//       // ...
//     });
// };
