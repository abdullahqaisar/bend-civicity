const User = require("../models/User");
const Car = require("../models/UserCar");
const Ride = require("../models/Ride");
var ObjectId = require("mongodb").ObjectId;

const saveImageToLocal = (phoneNumber, fileName, buffer) => {
  const trimBuffer = Buffer.from(buffer.split("base64,")[1], "base64");
  let DIR = "uploads/images/" + phoneNumber + "/profilepicture/";
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

exports.getUser = async (req, res) => {
  try {
    const userId = req.body.userId;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(201).json({ message: "Error finding user account" });
    }
    return res.status(201).send(user);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.uploadProfilePicture = async (req, res) => {
  try {
    const userId = req.user;
    const buffer = req.body.image;
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(201).json({ message: "Error finding user account" });
    }
    const phoneNumber = user.PhoneNumber;
    const imagePath = saveImageToLocal(
      phoneNumber,
      "profilepicture.png",
      buffer
    );
    user.ProfilePicture = imagePath;
    await user.save();
    return res.status(201).json({ message: "Profile Picture Uploaded" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.addCar = async (req, res) => {
  try {
    const { licensePlateNumber, brand, modelName, modelYear, colour } =
      req.body;

    const userId = req.user;
    let car = new Car({
      CarLiscensePlateNumber: licensePlateNumber,
      CarBrand: brand,
      CarModelName: modelName,
      CarModelYear: modelYear,
      CarColour: colour,
      UserId: userId,
    });

    car = await car.save();
    if (!car) {
      return res.status(500).json({
        message: "Error adding car!",
      });
    }
    const carId = car._id;
    const user = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { Cars: carId } }
    );
    if (!user) {
      return res.status(500).json({
        message: "Can't update user role!",
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
    console.log(car);
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
