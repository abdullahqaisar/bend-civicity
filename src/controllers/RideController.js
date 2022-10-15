const User = require("../models/User");
const Car = require("../models/Car");
const Ride = require("../models/Ride");
const Offer = require("../models/Offer");

var calculateDistance =
  require("../helpers/calculateDistanceFromCoordinates").calculateDistance;

exports.publishRide = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);
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

    let car = await Car.findById({ _id: carId });
    if (!car) {
      return res.status(400).json({ msg: "Car not found" });
    }
    const totalDistance = calculateDistance(
      startLat,
      startLong,
      dropLat,
      dropLong
    );

    let ride = new Ride({
      StartLat: startLat,
      StartLong: startLong,
      DropLat: dropLat,
      DropLong: dropLong,
      TotalDistance: totalDistance,
      StartLocation: startLocation,
      DropLocation: dropLocation,
      TotalSeats: totalSeats,
      TotalDistance: totalDistance,
      MaxLuggage: maxLuggage,
      AvailableSeats: totalSeats,
      PricePerSeat: pricePerSeat,
      StartTime: date,
      Driver: userId,
      Car: carId,
    });

    ride = await ride.save();
    if (!ride) {
      return res.status(401).json({
        message: "Error adding a ride!",
      });
    }

    car.Rides.push(ride._id);
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
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { RideStatus: true }
  );
  if (!ride) {
    return res.status(500).json({ message: "Error starting the ride" });
  }

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { ActiveRide: true }
  );
  if (!user) {
    return res.status(500).json({ message: "Can't find the user!" });
  }

  return res.status(201).json({ message: "Ride Started!" });
};

exports.priceOffers = async (req, res) => {
  try {
    const { rideId, price, seats, } = req.body;
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
    Driver: userId,
    RideStatus: true,
    Completed: true,
  });
  if (!rides) {
    return res.status(500).json({ message: "Error finding the rides" });
  }

  return res.status(201).json({ rides: rides });
};

exports.findPassengerCompletedRides = async (req, res) => {
  const { userId } = req.body;

  const rides = await Ride.find({
    Passengers: userId,
    RideStatus: true,
    Completed: true,
  });

  if (!rides) {
    return res.status(500).json({ message: "Error finding the rides" });
  }

  return res.status(201).json({ rides: rides });
};

exports.findRidesByDistance = async (req, res) => {
  try {
    const { lat, long } = req.body;
    const rides = await Ride.find({
      Completed: false,
      AvailableSeats: { $gt: 0 },
      StartTime: { $gte: req.body.startTime },
    });

    if (!rides) {
      return res.status(500).json({ message: "Error finding rides" });
    }
    var filteredRides = rides.filter((ride) => {
      //Find if ride is within 10km range
      const findDistance = calculateDistance(lat, long, ride.Lat, ride.Long);
      console.log(findDistance);
      if (findDistance <= 10) {
        return ride;
      }
    });
    return res.status(200).json({ rides: filteredRides });
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
  const { rideId, rating } = req.body;
  const ride = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { Rating: rating }
  );
  if (!ride) {
    return res.status(500).json({ message: "Error adding the rating" });
  }
  return res.status(201).json({ message: "Rating Added!" });
};

exports.findRides = async (req, res) => {
  try {
    const { lat2, lon2, startTime } = req.body;
    const findRides = await Ride.find({
      $or: [{ Completed: false }, { StartTime: { $gte: req.body.startTime } }],
    });
    if (!findRides) {
      return res.status(500).json({
        message: "Rides not found!",
      });
    }

    var filteredRides = findRides.filter((ride) => {
      const distance = getDistanceFromLatLon(ride.Lat, ride.Long, lat2, lon2);
      if (distance < 10) {
        return ride;
      }
    });
    return res.status(201).send(filteredRides);
  } catch (e) {
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
