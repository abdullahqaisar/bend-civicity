const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');
const CarController = require('../controllers/car.controller');

const auth = require('../middleware/auth');

router.patch('/addbio', auth, UserController.addBio);
router.patch('/addpreferences', auth, UserController.addPreferences);
router.patch('/uploadprofilepicture', auth, UserController.uploadProfilePicture);

router.get('/completedrides', auth, UserController.getCompletedRides);
router.get('/getuser', auth, UserController.getUser);
router.get('/getpulishedrides/:id', auth, UserController.getPublishedRides);
// router.patch("/bookride", auth, UserController.bookRide);
router.delete('/deletecar/:carid', auth, UserController.deleteCar);
router.post('/addcar', auth, UserController.addCar);
router.get('/getallcars', auth, UserController.getAllAddedCar);
router.get('/getdriverrating', auth, UserController.getDriverRating);
router.get('/getcarbybrands/:carbrand', CarController.getCarsByBrand);
router.get('/getcarbrands', CarController.getCarBrands);

module.exports = router;
