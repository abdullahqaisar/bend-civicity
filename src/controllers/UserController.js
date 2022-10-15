const User = require("../models/User");
const Car = require("../models/Car");
const Ride = require("../models/Ride");

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

exports.payByEasyPaisa = async (req, res) => {
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
    const easyPaisaNumber = req.body.easyPaisaNumber;
    const easyPaisa = {
      easyPaisaNumber: easyPaisaNumber,
    };
    const payment = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
      easyPaisa: easyPaisa,
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

    if (user.LicenseVerifiedStatus !== "Verified") {
      return res.status(401).json({ message: "License not verified" });
    }

    const {
      licensePlateNumber,
      brand,
      modelName,
      modelYear,
      colour,
      carImageBuffer,
      fuelAverage,      
    } = req.body;

    let car = new Car({
      CarLiscensePlateNumber: licensePlateNumber,
      CarBrand: brand,
      CarModelName: modelName,
      CarModelYear: modelYear,
      CarColour: colour,
      UserId: userId,
      CarImg: carImage,
      FuelAverage: fuelAverage,
    });

    let directory = "uploads/images/" + phoneNumber + "/car/";
    const carImageName = car._id + "Car.png";

    if (carImage !== undefined) {
      const carImgPath = await storeImage(
        carImageName,
        carImageBuffer,
        directory
      );
      newUser.CnicFront = carImgPath;
    }

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

exports.addBio = async (req, res) => {
  try {
    const bio = req.body.bio;
    const userId = req.user;
    const user = await User.findOneAndUpdate({ _id: userId }, { Bio: bio });
    if (!user) {
      return res.status(400).json({
        message: "An Error occoured!",
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
