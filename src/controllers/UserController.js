const User = require("../models/User");
const Car = require("../models/Car");
const Ride = require("../models/Ride");
const Ratings = require("../models/Rating");
const storeImage = require("../helpers/storeImageToServer").storeImage;

exports.getUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById({ _id: userId });
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
    // const userId = req.user;
    const userId = "630fc860feb366a99f31e0a4";
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

exports.payByVisaCard = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }
    const rideId = req.body.rideId;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(401).json({ message: "Error finding ride" });
    }
    const amount = req.body.amount;
    const cardNumber = req.body.cardNumber;
    const cardHolderName = req.body.cardHolderName;
    const expiryDate = req.body.expiryDate;
    const cvv = req.body.cvv;
    const card = {
      cardNumber: cardNumber,
      cardHolderName: cardHolderName,
      expiryDate: expiryDate,
      cvv: cvv,
    };
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      card: card,
    });
    if (!payment) {
      return res.status(401).json({ message: "Error making payment" });
    }
    ride.PaymentStatus = "Paid";
    await ride.save();
    return res.status(201).json({ message: "Payment Successful" });
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

    const {
      licensePlateNumber,
      brand,
      modelName,
      modelYear,
      colour,
      fuelAverage,
    } = req.body;

    let car = new Car({
      CarLiscensePlateNumber: licensePlateNumber,
      CarBrand: brand,
      CarModelName: modelName,
      CarModelYear: modelYear,
      CarColour: colour,
      UserId: userId,
      FuelAverage: fuelAverage,
    });

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

    car = await car.save();
    if (!car) {
      return res.status(500).json({
        message: "Error adding car!",
      });
    }
    const carId = car._id;
    user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { Cars: carId } }
    );
    if (!user) {
      return res.status(500).json({
        message: "Error pushing car to user!",
      });
    }
    console.log(carId);
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
    // const userId = req.user;
    const userId = "636f663e53855a49a79eae0c";
    console.log(req.user);
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }
    const cars = await User.findById({ _id: userId }).populate("Cars");
    return res.status(201).json({ cars: cars.Cars });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

//get average rating and all ratings
exports.getRating = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById({ _id: userId }).populate("RideRatings");
    if (!user) {
      return res.status(401).json({ message: "Error finding user account" });
    }

    const count = Object.keys(user.RideRatings).length;
    let sum = 0;

    console.log(count);
    for (let i = 0; i < count; i++) {
      sum += user.RideRatings[i].Score;
    }
    const averageRating = sum / count;
    return res
      .status(201)
      .json({ averageRating: averageRating, ratings: user.RideRatings });
  } catch (e) {
    res.status(500).json({ error: e.message });
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
    res.status(500).json({ error: e.message });
  }
};

exports.bookRide = async (req, res) => {
  try {
    const { rideId, seats } = req.body;
    const userId = req.user;
    const user = await User.findById({ _id: userId });
    if (user.ActiveRide) {
      return res.status(500).json({
        message: "You already have an active ride!",
      });
    }
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({
        message: "Ride not found!",
      });
    }
    if (ride.AvailableSeats <= seats) {
      return res.status(500).json({
        message: "Sorry, only " + ride.AvailableSeats + " seats are available!",
      });
    }
    const updateRide = await Ride.findByIdAndUpdate(
      { _id: rideId },
      {
        $push: {
          Passengers: {
            _id: req.body.userId,
            Seats: seats,
          },
        },
      }
    );

    if (!updateRide) {
      return res.status(500).json({
        message: "Error booking the ride!",
      });
    }

    const updateUser = await User.findByIdAndUpdate(
      { _id: req.body.userId },
      { ActiveRide: true }
    );

    if (!updateUser) {
      return res.status(500).json({
        message: "Error booking the ride!",
      });
    }

    return res.status(201).json({ message: "Ride Booked" });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};

//Date, Time, Price, Rider, Rating, RideID, Status, Distance, EndingCity, StartingCity
exports.getCompletedRides = async (req, res) => {
  try {
    const userId = req.user;
    //find all rides that are completed and have the user as a passenger
    const data = await Ride.find({
      $and: [
        { Status: "Completed" },
        { Passengers: { $elemMatch: { _id: userId } } },
      ],
    });
    if (!data) {
      return res.status(201).json({
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
    console.log(req.body);
    console.log(req.user);
    const bio = req.body.bio;
    const userId = req.user;
    const user = await User.findOneAndUpdate({ _id: userId }, { Bio: bio });
    if (!user) {
      return res.status(500).json({
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
      { $push: { Preferences: { Smoking: smoking, Music: music, Pets: pets } } }
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
    const car = await Car.find({ _id: carId });
    if (!car) {
      return res.status(404).json({ message: "Car not found!" });
    }

    const user = await User.findByIdAndUpdate(
      { _id: userId },
      { $pull: { Cars: carId } }
    );
    console.log(user);
    if (!user) {
      return res.status(401).json({ message: "Can't delete car!" });
    }
    return res.status(200).json({ message: "Car deleted!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
