const moongose = require("mongoose");

const jwt = require("jsonwebtoken");

// const otpGenerator = require("otp-generator"); //Generate OTP
// const twilio = require("twilio")(process.env.SID, process.env.AUTH_TOKEN);

const User = require("../models/user.model");

require("dotenv").config();

const storeImage = require("../helpers/storeImageToServer").storeImage;

exports.signup = async (req, res) => {
  try {
    let { firstName, lastName, email, phoneNumber, age, cnicBack, cnicFront } =
      req.body;
    let newUser = await new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      age,
    });
    cnicBack = "data:image/png;base64," + cnicBack;
    cnicFront = "data:image/png;base64," + cnicFront;
    // let directory = "uploads/images/" + phoneNumber + "/cnic/";
    // const backImgName = "CnicBack.png";
    // const frontImgName = "CnicFront.png";

    // if (cnicBack !== undefined && cnicFront !== undefined) {
    //   const backImgPath = await storeImage(backImgName, cnicBack, directory);
    //   const frontImgPath = await storeImage(frontImgName, cnicFront, directory);
    //   newUser.CnicFront = frontImgPath;
    //   newUser.CnicBack = backImgPath;
    // }
    newUser.CnicFront = cnicFront;
    newUser.CnicBack = cnicBack;
    newUser = await newUser.save();
    if (!newUser) {
      return res.status(500).json({ msg: "User not saved!" });
    }
    const token = await jwt.sign(
      {
        phoneNumber: phoneNumber,
        userId: newUser._id,
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

exports.checkAccount = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const user = await User.findOne({ phoneNumber: phoneNumber }).populate(
      "Ratings"
    );
    if (!user) {
      return res
        .status(401)
        .json({ message: "Account does not exist! Please proceed to signup" });
    }
    const token = await jwt.sign(
      {
        phoneNumber: phoneNumber,
        userId: user._id,
      },
      process.env.JWT_KEY
    );

    ///////User Login, ADD Driver Login too///////////////////////////

    return res.status(201).json({
      message: "Login successful!",
      token: token,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio,
      rating: user.ratings,
      verificationStatus: {
        cnic: user.verificationStatus.cnic,
        drivingLicense: user.verificationStatus.license,
        email: user.verificationStatus.email,
        phoneNumber: user.verificationStatus.phoneNumber,
      },
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

// exports.getOtp = async (req, res) => {
//   try {
//     const phoneNumber = req.body.phoneNumber;
//     const otp = otpGenerator.generate(6, {
//       digits: true,
//       lowerCaseAlphabets: false,
//       upperCaseAlphabets: false,
//       specialChars: false,
//     });

//     // const message = await twilio.messages
//     //   .create({
//     //     from: "+16693222805",
//     //     to: "+92" + phoneNumber,
//     //     body: "Verification code for CiviCity is " + otp,
//     //   })
//     //   .then((res) => console.log("message sent"))
//     //   .catch((err) => console.log(err));

//     // const otp = new Otp({
//     //   PhoneNumber: phoneNumber,
//     //   Otp: otp,
//     // });

//     let otpObj = new Otp({
//       PhoneNumber: phoneNumber,
//       Otp: "123456",
//     });

//     otpObj = await otpObj.save();
//     if (!otpObj) {
//       console.log("OTP not sent");
//       return res.status(400).json({ msg: "Otp not saved!" });
//     }
//     console.log(otpObj);
//     console.log("OTP sent");
//     return res.status(201).json({
//       message: "OTP sent!",
//     });
//   } catch (err) {
//     console.log("OTP not sent!");
//     res.status(500).json({
//       error: err,
//     });
//   }
// };

// exports.verifyOtp = async (req, res) => {
//   try {
//     const { otp, phoneNumber } = req.body;
//     const verifyOtp = await Otp.find({
//       $and: [{ Otp: otp }, { PhoneNumber: phoneNumber }],
//     });
//     if (verifyOtp < 1) {
//       return res.status(500).json({
//         message: "Incorrect OTP!",
//       });
//     }

//     const existingUser = await User.findOne({ PhoneNumber: phoneNumber });
//     if (existingUser) {
//       const user = await User.find({ PhoneNumber: phoneNumber });
//       if (user.length < 1) {
//         return res.status(401).json({
//           message: "Login failed!",
//         });
//       } else {
//         const token = jwt.sign(
//           {
//             phoneNumber: user[0].PhoneNumber,
//             userId: user[0]._id,
//           },
//           process.env.JWT_KEY
//         );
//         res.status(307).json({
//           message: "Login successful!",
//           token: token,
//           user: user[0],
//         });
//       }
//     } else {
//       return res.status(200).json({
//         message: "Please continue registration!",
//       });
//     }
//   } catch (e) {
//     res.status(500).json({ error: e.message });
//   }
// };
