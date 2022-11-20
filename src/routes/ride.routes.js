const express = require("express");

var router = express.Router();

const RideController = require("../controllers/ride.controller");

const auth = require("../middleware/auth");

router.post("/searchrides", RideController.searchRides);
router.post("/publishride", auth, RideController.publishRide);
router.patch("/completeride", auth, RideController.completeRide);
router.post("/addrating", auth, RideController.addRating);
router.get("/getDriverDetails/:driverid", auth, RideController.getDriverDetails);
router.get("/offerRide", auth, RideController.offerRide);
module.exports = router;
