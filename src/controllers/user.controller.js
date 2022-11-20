const User = require("../models/user.model");
const Ride = require("../models/ride.model");
const Rating = require("../models/rating.model");

const storeImage = require("../helpers/storeImageToServer").storeImage;

exports.getUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    let user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }
    return res.status(201).send(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user;
    // const userId = "630fc860feb366a99f31e0a4";
    const buffer = req.body.image;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(201).json({ message: "Error finding user account" });
    }

    const phoneNumber = user.PhoneNumber;
    let directory = "uploads/images/" + phoneNumber + "/profilepicture/";
    const imagePath = storeImage("profilepicture.png", buffer, directory);

    user.ProfilePicture = imagePath;
    await user.save();
    return res.status(201).json({ message: "Profile Picture Uploaded" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.verifyLicenseImage = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }
    const licenseImagebuffer = req.body.image;
    const phoneNumber = user.PhoneNumber;
    let directory = "uploads/images/" + phoneNumber + "/license/";
    const imagePath = storeImage("license.png", licenseImagebuffer, directory);
    user.LicenseImage = imagePath;
    user.LicenseVerifiedStatus = "Pending";
    await user.save();
    return res.status(201).json({ message: "License Image Uploaded" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    const userId = req.user;
    let user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }

    // if (user.LicenseVerifiedStatus !== "Verified") {
    //   return res.status(401).json({ message: "License not verified" });
    // }

    // let directory = "uploads/images/" + phoneNumber + "/car/";
    // const carImageName = car._id + "Car.png";

    // if (carImage !== undefined) {
    //   const carImgPath = await storeImage(
    //     carImageName,
    //     carImageBuffer,
    //     directory
    //   );
    //   newUser.CnicFront = carImgPath;
    // }

    const { licensePlateNumber, brand, modelName, modelYear, colour } =
      req.body;

    user.DriverData.Cars.push({
      LicensePlateNumber: licensePlateNumber,
      Brand: brand,
      ModelName: modelName,
      ModelYear: modelYear,
      Colour: colour,
    });

    if (user.UserType !== true) {
      user.UserType = true;
    }

    user = await user.save();
    if (!user) {
      return res.status(500).json({
        message: "Error adding car!",
      });
    }

    return res.status(201).json({
      message: "Car Added!",
      carId: carId,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.getAllAddedCar = async (req, res) => {
  try {
    const userId = req.user;

    //only select cars from user
    const cars = User.findById({ _id: userId }).select("DriverData.Cars");
    if (!cars) {
      return res.status(500).json({ message: "Error finding Driver" });
    }
    return res.status(201).json({ cars: cars });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//get average rating and all ratings
exports.getDriverRating = async (req, res) => {
  try {
    const userId = req.user;

    const user = await User.findById({ _id: userId }).populate({
      path: "Ratings",
      match: { UserRole: 1 },
    });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }

    const count = Object.keys(user.Ratings).length;
    let sum = 0;

    console.log(count);
    for (let i = 0; i < count; i++) {
      sum += user.Ratings[i].Score;
    }
    const averageRating = sum / count;
    return res
      .status(201)
      .json({ averageRating: averageRating, ratings: user.Ratings });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

exports.getPublishedRides = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = await Ride.find({ Driver: userId });
    if (!data) {
      return res.status(201).json({
        message: "No rides found!",
      });
    }
    return res.status(201).send(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

// exports.bookRide = async (req, res) => {
//   try {
//     const { rideId, seats } = req.body;
//     const userId = req.user;
//     const user = await User.findById({ _id: userId });
//     if (user.ActiveRide) {
//       return res.status(401).json({
//         message: "You already have an active ride!",
//       });
//     }
//     const ride = await Ride.findById({ _id: rideId });
//     if (!ride) {
//       return res.status(401).json({
//         message: "Ride not found!",
//       });
//     }
//     if (ride.AvailableSeats <= seats) {
//       return res.status(500).json({
//         message: "Sorry, only " + ride.AvailableSeats + " seats are available!",
//       });
//     }
//     const updateRide = await Ride.findByIdAndUpdate(
//       { _id: rideId },
//       {
//         $push: {
//           Passengers: {
//             _id: req.body.userId,
//             Seats: seats,
//           },
//         },
//       }
//     );

//     if (!updateRide) {
//       return res.status(500).json({
//         message: "Error booking the ride!",
//       });
//     }

//     const updateUser = await User.findByIdAndUpdate(
//       { _id: req.body.userId },
//       { ActiveRide: true },
//       { ActiveRideId: rideId }
//     );

//     if (!updateUser) {
//       return res.status(500).json({
//         message: "Error booking the ride!",
//       });
//     }

//     return res.status(201).json({ message: "Ride Booked" });
//   } catch (e) {
//     return res.status(500).json({ error: e.message });
//   }
// };

//find all rides that are completed and have the user as a passenger
exports.getCompletedRides = async (req, res) => {
  try {
    const userId = req.user;

    const data = await Ride.find({
      $and: [{ Status: 2 }, { Passengers: { $elemMatch: { _id: userId } } }],
    });
    if (!data) {
      return res.status(400).json({
        message: "No rides found!",
      });
    }
    return res.status(201).send(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addBio = async (req, res) => {
  try {
    const bio = req.body.bio;
    const userId = req.user;
    const user = await User.findOneAndUpdate({ _id: userId }, { Bio: bio });
    if (!user) {
      return res.status(400).json({
        message: "An Error occoured while adding bio!",
      });
    }
    return res.status(201).json({
      message: "Bio Added!",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.addPreferences = async (req, res) => {
  try {
    const userId = req.user;
    const { smoking, music, pets } = req.body;
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        Preferences: {
          smoking: smoking,
          music: music,
          pets: pets,
        },
      }
    );
    if (!user) {
      return res.status(500).json({
        message: "An Error occoured while adding preferences!",
      });
    }

    return res.status(201).json({
      message: "Preferences Added!",
    });
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({ error: err.message });
  }
};

exports.deleteCar = async (req, res) => {
  try {
    const carId = String(req.params.carid);

    const userId = req.user;
    const car = await Car.findById({ _id: carId });
    if (!car) {
      return res.status(404).json({ message: "Car not found!" });
    }

    const user = await User.findOneAndUpdate(
      { UserId: userId },
      { $pull: { Cars: carId } }
    );

    if (!user) {
      return res.status(500).json({ message: "Can't delete car!" });
    }

    const deletedCar = await Car.findByIdAndDelete({ _id: car });
    if (!deletedCar) {
      return res.status(500).json({ message: "Can't delete car!" });
    }

    return res.status(200).json({ message: "Car deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
