const User = require("../models/User");
const Car = require("../models/UserCar");
const Ride = require("../models/Ride");

var calculateDistance = require("../helpers/calculateDistanceFromCoordinates").calculateDistance;

exports.publishRide = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);
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
      date,
    } = req.body;

    const userId = req.user;
    let ride = new Ride({
      StartLat: startLat,
      StartLong: startLong,
      DropLat: dropLat,
      DropLong: dropLong,
      StartLocation: startLocation,
      DropLocation: dropLocation,
      TotalSeats: totalSeats,
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

    const car = await Car.findByIdAndUpdate(
      { _id: carId },
      { IsCarInRide: true }
    );

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
