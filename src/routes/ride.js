const express = require("express");

var router = express.Router();

const RideController = require("../controllers/RideController");

const auth = require("../middleware/auth");

router.post("/findrides", RideController.findRidesByDistance);
router.post("/publishride", auth, RideController.publishRide);
router.patch("/completeride", auth, RideController.completeRide);
router.post("/addrating", auth, RideController.addRating)
module.exports = router;
