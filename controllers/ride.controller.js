const User = require('../models/user.model');
const Ride = require('../models/ride.model');
const Car = require('../models/car.model');
const Rating = require('../models/rating.model');

const {
  calculateDistance,
} = require('../helpers/calculateDistanceFromCoordinates');

// When user clicks on Offer Ride Button
exports.offerRide = async (req, res) => {
  const userId = req.user;
  const user = await User.findById(userId);

  if (!user) {
    return res.status(500).json({
      message: 'Error finding the user',
    });
  }

  if (user.VerificationStatus.CNIC !== 2) {
    throw new Error('CNIC verification required');
  }

  return res.status(201).json({
    message: 'Please proceed adding a ride!',
  });
};

exports.publishRide = async (req, res) => {
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

  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Find the car by carId within the user's data
  const car = user.driverData?.cars.find((car) => car.id.toString() === carId);

  if (!car) {
    throw new Error('Car not found');
  }

  if (car.isCarInRide) {
    throw new Error('Car is already in a ride');
  }

  const totalDistance = calculateDistance(
    startLat,
    startLong,
    dropLat,
    dropLong,
  );

  const ride = new Ride({
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

  const savedRide = await ride.save();
  if (!savedRide) {
    throw new Error('Error adding a ride!');
  }

  return res.status(201).json({
    message: 'Ride Added!',
  });
};

exports.startRide = async (req, res) => {
  const { rideId, userId } = req.body;
  const ride = await Ride.findByIdAndUpdate({ _id: rideId }, { Status: 1 });
  if (!ride) {
    return res.status(500).json({ message: 'Error starting the ride' });
  }

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { activeRide: true },
    { activeRideId: rideId },
  );

  // Add the ride to the all user's active rides Here

  if (!user) {
    return res.status(500).json({ message: "Can't find the user!" });
  }

  return res.status(201).json({ message: 'Ride Started!' });
};

exports.priceOffers = async (req, res) => {
  const { rideId, price, seats } = req.body;
  const userId = req.user;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(500).json({
      message: 'Ride not found!',
    });
  }

  // Check if user already has an offer for this ride
  const existingOffer = ride.offers.find(
    (offer) => offer.offeredBy.toString() === userId.toString(),
  );

  if (existingOffer) {
    return res.status(500).json({
      message: 'You already have an offer for this ride!',
    });
  }

  // Create a new offer object
  const newOffer = {
    price,
    seats,
    offerStatus: 'Active',
    offeredBy: userId,
  };

  // Update the ride document by pushing the new offer to the offers array
  ride.offers.push(newOffer);
  await ride.save();

  return res.status(201).json({
    message: 'Offer added!',
  });
};

exports.acceptOffer = async (req, res) => {
  const userId = req.user;
  const { rideId } = req.body; // Assuming rideId is sent in the request body

  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(500).json({
      message: 'Ride not found!',
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(500).json({
      message: 'User not found!',
    });
  }

  // Find the user's offer for this ride
  const userOffer = ride.offers.find(
    (offer) => offer.offeredBy.toString() === userId.toString(),
  );

  if (!userOffer) {
    return res.status(500).json({
      message: "You don't have an offer for this ride!",
    });
  }

  // Update the offer status to 'Accepted' within the ride document
  userOffer.offerStatus = 'Accepted';
  ride.availableSeats -= 1; // Decrement available seats

  await ride.save();

  return res.status(201).json({
    message: 'Offer accepted!',
  });
};

exports.rejectOffer = async (req, res) => {
  const { rideId, userId } = req.body;

  const ride = await Ride.findById(rideId);
  if (!ride) {
    return res.status(500).json({
      message: 'Ride not found!',
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(500).json({
      message: 'User not found!',
    });
  }

  // Find the user's offer for this ride
  const userOffer = ride.offers.find(
    (offer) => offer.offeredBy.toString() === userId.toString(),
  );

  if (!userOffer) {
    return res.status(500).json({
      message: "You don't have an offer for this ride!",
    });
  }

  // Update the offer status to 'Rejected' within the ride document
  userOffer.offerStatus = 'Rejected';

  await ride.save();

  return res.status(201).json({
    message: 'Offer rejected!',
  });
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
    user.CurrentLong,
  );
  const price = distance * ride.PricePerSeat;
  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    { ActiveRide: false, Balance: user.Balance + price },
  );
  if (!updatedUser) {
    return res.status(500).json({ message: "Can't find the user!" });
  }
  const updatedRide = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { AvailableSeats: ride.AvailableSeats + 1 },
  );
  if (!updatedRide) {
    return res.status(500).json({ message: "Can't find the ride!" });
  }
  return res.status(201).json({ message: 'Passenger dropped!' });
};

exports.findDriverCompletedRides = async (req, res) => {
  const { userId } = req.body;

  const rides = await Ride.find({
    driver: userId,
    status: 2,
  });
  if (!rides) {
    return res.status(500).json({ message: 'Error finding the rides' });
  }

  return res.status(201).json({ rides });
};

exports.findPassengerCompletedRides = async (req, res) => {
  const { userId } = req.body;

  const rides = await Ride.find({
    passengers: { id: userId },
    status: 2,
  });

  if (!rides) {
    return res.status(500).json({ message: 'Error finding the rides' });
  }

  return res.status(201).json({ rides });
};

exports.searchRides = async (req, res) => {
  const { startLat, startLong, dropLat, dropLong } = req.body;

  const rides = await Ride.find({
    status: 0,
    availableSeats: { $gt: 0 },
    // StartTime: { $gte: req.body.startTime },
  }).populate('driver', '_id FirstName LastName ');
  if (!rides) {
    return res.status(500).json({ message: 'Error finding rides' });
  }

  let filteredRides = rides.filter((ride) => {
    // check if ride starting location is within 10km range
    const distance = calculateDistance(
      startLat,
      startLong,
      ride.start.latitide,
      ride.start.longitude,
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
      ride.drop.longitude,
    );
    if (distance <= 10) {
      return ride;
    }
  });

  return res.status(200).json({ rides: filteredRides });
};

exports.getDriverDetails = async (req, res) => {
  const driverId = req.params.driverid;

  const driver = await User.findById({ _id: driverId });
  if (!driver) {
    return res.status(500).json({ message: 'Error finding the driver' });
  }

  const driverRatings = driver.ratings.filter((rating) => {
    if (rating.userRole === 1) {
      return rating;
    }
  });

  return res.status(201).json({
    age: driver.Age,
    experienceLevel: driver.DriverData.experienceLevel,
    verificationStatus: {
      cnic: driver.verificationStatus.cnic,
      drivingLicense: driver.VerificationStatus.license,
    },
    bio: driver.bio,
    memberSince: driver.memberSince,
    ratings: driverRatings,
  });
};

exports.dropOffPassenger = async (req, res) => {
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
    user.CurrentLong,
  );
  const price = distance * ride.PricePerSeat;

  const updatedUser = await User.findByIdAndUpdate(
    { _id: userId },
    { ActiveRide: false, Balance: user.Balance + price },
  );
  if (!updatedUser) {
    return res.status(500).json({ message: "Can't find the user!" });
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { AvailableSeats: ride.AvailableSeats + 1 },
  );
  if (!updatedRide) {
    return res.status(500).json({ message: "Can't find the ride!" });
  }

  return res.status(201).json({ message: 'Passenger dropped!' });
};

exports.cancelRide = async (req, res) => {
  const { rideId } = req.body;
  const ride = await Ride.findByIdAndUpdate({ _id: rideId }, { status: 3 });
  if (!ride) {
    return res.status(500).json({ message: 'Error cancelling the ride' });
  }

  // increase the booking seats and stuff not update isCarInRide

  const car = await Car.findByIdAndUpdate(
    { _id: ride.Car },
    { isCarInRide: false },
  );

  if (!car) {
    return res.status(500).json({ message: 'Error cancelling the ride' });
  }

  return res.status(201).json({ message: 'Ride Cancelled!' });
};

exports.addRating = async (req, res) => {
  const userId = req.user;
  const { rideId, score, comment } = req.body;

  const ride = await Ride.findById({ _id: rideId });
  if (!ride) {
    return res.status(500).json({ message: 'Error adding the rating' });
  }

  let rating = new Rating({
    Score: score,
    Comment: comment,
    Date: Date.now(),
    User: userId,
  });

  rating = await rating.save();

  if (!rating) {
    return res.status(500).json({ message: 'Error adding the rating' });
  }

  const updatedRide = await Ride.findByIdAndUpdate(
    { _id: rideId },
    { Ratings: rating.id },
  );

  if (!updatedRide) {
    return res.status(500).json({ message: 'Error adding the rating to ride' });
  }

  const driver = await User.findByIdAndUpdate(
    { _id: ride.Driver },
    { $push: { Ratings: rating.id } },
  );

  if (!driver) {
    return res
      .status(500)
      .json({ message: 'Error adding the rating to driver' });
  }

  return res.status(201).json({ message: 'Rating added!' });
};

exports.completeRide = async (req, res) => {
  const { rideId, userId, carId } = req.body;
  const ride = await Ride.findOneAndUpdate({ _id: rideId }, { status: 2 });
  if (!ride) {
    return res.status(400).json({
      message: 'An error occurred!',
    });
  }

  const car = await Car.findByIdAndUpdate(
    { _id: carId },
    { isCarInRide: false },
  );
  if (!car) {
    return res.status(500).json({
      message: 'Error completing ride!',
    });
  }

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { activeRide: false },
  );
  if (!user) {
    return res.status(500).json({
      message: 'Error completing ride!',
    });
  }

  return res.status(201).json({
    message: 'Ride Completed!',
  });
};
