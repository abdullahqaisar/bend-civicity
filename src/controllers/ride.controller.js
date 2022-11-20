const User = require("../models/user.model");
const Ride = require("../models/ride.model");
const Rating = require("../models/rating.model");

var calculateDistance =
  require("../helpers/calculateDistanceFromCoordinates").calculateDistance;

// When user clicks on Offer Ride Button
exports.offerRide = async (req, res) => {
  try {
    const userId = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(500).json({
        message: "Error finding the user",
      });
    }
    if (user.VerificationStatus.CNIC === 0) {
      return res.status(401).json({
        message: "You are not verified yet",
      });
    }
    if (user.VerificationStatus.CNIC === 1) {
      return res.status(400).json({
        message: "Your CNIC is pending, please wait for it to be approved.",
      });
    }

    if (user.VerificationStatus.CNIC === 2) {
      return res.status(201).json({
        message: "Please proceed adding a ride!",
      });
    }
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Server Error",
    });
  }
};

exports.publishRide = async (req, res) => {
  try {

    const userId = req.user;
    const {
      startLat,
      startLong,
      dropLat,
      dropLong,
      carId,
      startLocation,
      dropLocation,
      totalSeats,
      pricePerSeat,
      maxLuggage,
      date,
    } = req.body;

    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    //find the car by carId from user
    const car = user.cars.findOne((car) => car._id == carId);
    console.log(car);
    if (!car) {
      return res.status(400).json({ msg: "Car not found" });
    }

    if (car.isCarInRide) {
      return res.status(400).json({ msg: "Car is already in a ride" });
    }
    const totalDistance = calculateDistance(
      startLat,
      startLong,
      dropLat,
      dropLong
    );

    let ride = new Ride({
      start: {
        latitide: startLat,
        longitude: startLong,
        location: startLocation,
      },
      drop: {
        latitide: dropLat,
        longitude: dropLong,
        location: dropLocation,
      },
      totalDistance,
      totalSeats,
      maxLuggage,
      pricePerSeat,
      startTime: date,
      driver: userId,
      car: carId,
    });

    ride = await ride.save();
    if (!ride) {
      return res.status(401).json({
        message: "Error adding a ride!",
      });
    }
    console.log("RideId is " + ride._id);

    car = await Car.findOneAndUpdate(
      { _id: carId },
      { $push: { Rides: ride._id } }
    );

    car.IsCarInRide = true;
    car = await car.save();

    if (!car) {
      return res.status(400).json({
        message: "Error adding the ride!",
      });
    }
    return res.status(201).json({
      message: "Ride Added!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.startRide = async (req, res) => {
  const { rideId, userId } = req.body;
  const ride = await Ride.findByIdAndUpdate({ _id: rideId }, { Status: 1 });
  if (!ride) {
    return res.status(500).json({ message: "Error starting the ride" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { ActiveRide: true },
    { ActiveRideId: rideId }
  );

  // Add the ride to the all user's active rides Here

  if (!user) {
    return res.status(500).json({ message: "Can't find the user!" });
  }

  return res.status(201).json({ message: "Ride Started!" });
};

exports.priceOffers = async (req, res) => {
  try {
    const { rideId, price, seats } = req.body;
    const userId = req.user;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({
        message: "Ride not found!",
      });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(500).json({
        message: "User not found!",
      });
    }
    let userRide = await Offer.findOne({
      Ride: rideId,
      User: userId,
    });
    if (userRide) {
      return res.status(500).json({
        message: "You already have an offer for this ride!",
      });
    }
    userRide = new Offer({
      Ride: rideId,
      User: userId,
      Price: price,
      Seats: seats,
      OfferStatus: "Active",
    });
    userRide = await userRide.save();
    if (!userRide) {
      return res.status(500).json({
        message: "Error adding offer!",
      });
    }
    return res.status(201).json({
      message: "Offer added!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.acceptOffer = async (req, res) => {
  try {
    const userId = req.user;
    const rideId = req.body;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({
        message: "Ride not found!",
      });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(500).json({
        message: "User not found!",
      });
    }
    const userRide = await Offer.findOne({
      Ride: rideId,
      User: userId,
    });
    if (!userRide) {
      return res.status(500).json({
        message: "You don't have an offer for this ride!",
      });
    }
    const acceptedRide = await Offer.findOneAndUpdate(
      { Ride: rideId },
      { Accepted: true }
    );
    if (!acceptedRide) {
      return res.status(500).json({
        message: "Error accepting the offer!",
      });
    }
    const updatedRide = await Ride.findByIdAndUpdate(
      { _id: rideId },
      { AvailableSeats: ride.AvailableSeats - 1 }
    );
    if (!updatedRide) {
      return res.status(500).json({
        message: "Error accepting the offer!",
      });
    }
    return res.status(201).json({
      message: "Offer accepted!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.rejectOffer = async (req, res) => {
  try {
    const { rideId, userId } = req.body;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({
        message: "Ride not found!",
      });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(500).json({
        message: "User not found!",
      });
    }
    const userRide = await Offer.findOne({
      Ride: rideId,
      User: userId,
    });
    if (!userRide) {
      return res.status(500).json({
        message: "You don't have an offer for this ride!",
      });
    }
    const rejectedRide = await Offer.findOneAndUpdate(
      { Ride: rideId },
      { Rejected: true }
    );
    if (!rejectedRide) {
      return res.status(500).json({
        message: "Error rejecting the offer!",
      });
    }
    return res.status(201).json({
      message: "Offer rejected!",
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.dropPassengerOnRoute = async (req, res) => {
  const { rideId, userId } = req.body;
  const ride = await Ride.findById({ _id: rideId });
  if (!ride) {
    return res.status(500).json({ message: "Can't find the ride!" });
  }
  const user = await User.findById({ _id: userId });
  if (!user) {
    return res.status(500).json({ message: "Can't find the user!" });
  }
  const distance = calculateDistance(
    ride.StartLat,
    ride.StartLong,
    user.CurrentLat,
    user.CurrentLong
  );
  const price = distance * ride.PricePerSeat;
  const user1 = await User.findByIdAndUpdate(
    { _id: userId },
    { ActiveRide: false, Balance: user.Balance + price }
  );
  if (!user1) {
    return res.status(500).json({ message: "Can't find the user!" });
  }
  const ride1 = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { AvailableSeats: ride.AvailableSeats + 1 }
  );
  if (!ride1) {
    return res.status(500).json({ message: "Can't find the ride!" });
  }
  return res.status(201).json({ message: "Passenger dropped!" });
};

exports.findDriverCompletedRides = async (req, res) => {
  const { userId } = req.body;

  const rides = await Ride.find({
    driver: userId,
    status: 2,
  });
  if (!rides) {
    return res.status(500).json({ message: "Error finding the rides" });
  }

  return res.status(201).json({ rides: rides });
};

exports.findPassengerCompletedRides = async (req, res) => {
  const { userId } = req.body;

  const rides = await Ride.find({
    passengers: { id: userId },
    RideStatus: 2,
  });

  if (!rides) {
    return res.status(500).json({ message: "Error finding the rides" });
  }

  return res.status(201).json({ rides: rides });
};

exports.searchRides = async (req, res) => {
  try {
    const { startLat, startLong, dropLat, dropLong } = req.body;
    const rides = await Ride.find({
      status: 0,
      availableSeats: { $gt: 0 },
      // StartTime: { $gte: req.body.startTime },
    }).populate("driver", "_id FirstName LastName ");

    if (!rides) {
      return res.status(500).json({ message: "Error finding rides" });
    }
    let filteredRides = rides.filter((ride) => {
      // check if ride starting location is within 10km range
      const distance = calculateDistance(
        startLat,
        startLong,
        ride.start.latitide,
        ride.start.longitude
      );
      if (distance <= 10) {
        return ride;
      }
    });

    filteredRides = rides.filter((ride) => {
      // check if ride ending location is within 10km range
      const distance = calculateDistance(
        dropLat,
        dropLong,
        ride.drop.latitide,
        ride.drop.longitude
      );
      if (distance <= 10) {
        return ride;
      }
    });
    return res.status(200).json({ rides: filteredRides });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.getDriverDetails = async (req, res) => {
  try {
    const driverId = req.params.driverid;
    const driver = await User.findById({ _id: driverId });
    if (!driver) {
      return res.status(500).json({ message: "Error finding the driver" });
    }
    const driverRatings = driver.Ratings.filter((rating) => {
      if (rating.userRole === 1) {
        return rating;
      }
    });

    return res.status(201).json({
      age: driver.Age,
      experienceLevel: driver.DriverData.ExperienceLevel,
      verificationStatus: {
        CNIC: driver.VerificationStatus.CNIC,
        DrivingLicense: driver.VerificationStatus.License,
      },
      bio: driver.Bio,
      memberSince: driver.MemberSince,
      ratings: driverRatings,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.dropOffPassenger = async (req, res) => {
  try {
    const { rideId, userId } = req.body;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({ message: "Can't find the ride!" });
    }
    const user = await User.findById({ _id: userId });
    if (!user) {
      return res.status(500).json({ message: "Can't find the user!" });
    }
    const distance = calculateDistance(
      ride.StartLat,
      ride.StartLong,
      user.CurrentLat,
      user.CurrentLong
    );
    const price = distance * ride.PricePerSeat;
    const user1 = await User.findByIdAndUpdate(
      { _id: userId },
      { ActiveRide: false, Balance: user.Balance + price }
    );
    if (!user1) {
      return res.status(500).json({ message: "Can't find the user!" });
    }
    const ride1 = await Ride.findByIdAndUpdate(
      { _id: rideId },
      { AvailableSeats: ride.AvailableSeats + 1 }
    );
    if (!ride1) {
      return res.status(500).json({ message: "Can't find the ride!" });
    }
    return res.status(201).json({ message: "Passenger dropped!" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.cancelRide = async (req, res) => {
  const { rideId } = req.body;
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { Cancelled: true }
  );
  if (!ride) {
    return res.status(500).json({ message: "Error cancelling the ride" });
  }

  const car = await Car.findByIdAndUpdate(
    { _id: ride.Car },
    { IsCarInRide: false }
  );

  if (!car) {
    return res.status(500).json({ message: "Error cancelling the ride" });
  }

  return res.status(201).json({ message: "Ride Cancelled!" });
};

exports.addRating = async (req, res) => {
  try {
    const userId = req.user;
    const { rideId, score, comment } = req.body;
    const ride = await Ride.findById({ _id: rideId });
    if (!ride) {
      return res.status(500).json({ message: "Error adding the rating" });
    }

    let rating = new Rating({
      Score: score,
      Comment: comment,
      Date: Date.now(),
      User: userId,
    });

    rating = await rating.save();

    if (!rating) {
      return res.status(500).json({ message: "Error adding the rating" });
    }

    const ride1 = await Ride.findByIdAndUpdate(
      { _id: rideId },
      { Ratings: rating._id }
    );

    if (!ride1) {
      return res
        .status(500)
        .json({ message: "Error adding the rating to ride" });
    }

    const driver = await User.findByIdAndUpdate(
      { _id: ride.Driver },
      { $push: { Ratings: rating._id } }
    );

    if (!driver) {
      return res
        .status(500)
        .json({ message: "Error adding the rating to driver" });
    }

    return res.status(201).json({ message: "Rating added!" });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
};

exports.completeRide = async (req, res) => {
  try {
    const { rideId, userId, carId } = req.body;
    const ride = await Ride.findOneAndUpdate(
      { _id: rideId },
      { RideStatus: false },
      { Completed: true }
    );
    if (!ride) {
      return res.status(400).json({
        message: "An error occurred!",
      });
    }
    const car = await Car.findByIdAndUpdate(
      { _id: carId },
      { IsCarInRide: false }
    );
    if (!car) {
      return res.status(500).json({
        message: "Error completing ride!",
      });
    }
    return res.status(201).json({
      message: "Ride Completed!",
    });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
};
