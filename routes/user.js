const express = require("express");
var router = express.Router();

const UserController = require("../controllers/UserController");
const CarController = require("../controllers/CarController");

const auth = require("../middleware/auth");

router.patch("/addbio", auth, UserController.addBio);
router.get("/getuser", auth, UserController.getUser);
router.get("/getpulishedrides/:id", auth, UserController.getPublishedRides);
router.patch("/bookride", auth, UserController.bookRide);
router.delete("/deletecar/:carid", auth, UserController.deleteCar);
router.post("/addcar", UserController.addCar);
// router.post("/addcar", CarController.addCar);
router.get("/getcarbybrands/:carbrand", CarController.getCarsByBrand);
router.get("/getcarbrands", CarController.getCarBrands);

module.exports = router;
