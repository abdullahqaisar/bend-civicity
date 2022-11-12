const express = require("express");
var router = express.Router();

const UserController = require("../controllers/UserController");
const CarController = require("../controllers/CarController");

const auth = require("../middleware/auth");

router.patch("/addbio", auth, UserController.addBio);
router.patch("/addpreferences", auth, UserController.addPreferences);
router.get("/completedrides", auth, UserController.getCompletedRides);
router.get("/getuser", auth, UserController.getUser);
router.get("/getpulishedrides/:id", auth, UserController.getPublishedRides);
router.patch("/bookride", auth, UserController.bookRide);
router.delete("/deletecar/:carid", auth, UserController.deleteCar);
router.post("/addcar", auth, UserController.addCar);
router.get("/getallcars", auth, UserController.getAllAddedCar);
router.get("/getrating", auth, UserController.getRating);
router.get("/getcarbybrands/:carbrand", CarController.getCarsByBrand);
router.get("/getcarbrands", CarController.getCarBrands);
router.patch("/uploadprofilepicture", UserController.uploadProfilePicture);

module.exports = router;
