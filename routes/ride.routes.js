const express = require('express');

const router = express.Router();

const RideController = require('../controllers/ride.controller');

const auth = require('../middleware/auth');

router.get('/', auth, RideController.getRides);
router.post('/', auth, RideController.publishRide);
router.patch('/', auth, RideController.updateRide);
router.patch('/rate', auth, RideController.addRating);
router.get('/:driverid', auth, RideController.getDriverDetails);
router.put('/offerRide', auth, RideController.offerRide);
module.exports = router;
