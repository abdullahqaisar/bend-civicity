const express = require("express");

var router = express.Router();

const RideController = require("../controllers/RideController");

const auth = require("../middleware/auth");

router.post("/findrides", RideController.findRidesByDistance);
router.post("/publishride", RideController.publishRide);
router.patch("/completeride", auth, RideController.completeRide);

module.exports = router;
