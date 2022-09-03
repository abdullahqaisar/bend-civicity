const User = require("../models/User");
const Car = require("../models/UserCar");
const Ride = require("../models/Ride");

exports.publishRide = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user);
    const {
      carId,
      startLocation,
      dropLocation,
      totalSeats,
      pricePerSeat,
      date,
    } = req.body;

    const userId = req.user;
    let ride = new Ride({
      Lat: 43.6556888744308,
      Long: 93.02181515650089,
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

function getDistanceFromLatLon(lat1, lon1, lat2, lon2) {
  var radius = 6371;
  var dLat = deg2rad(lat2 - lat1);
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = radius * c;
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

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
      const distanceFromRide = getDistanceFromLatLon(
        lat,
        long,
        ride.Lat,
        ride.Long
      );
      if (distanceFromRide <= 10) {
        return ride;
      }
    });
    return res.status(200).json({ rides: filteredRides });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ error: e.message });
  }
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
