const express = require('express');

const router = express.Router();

const CarController = require('../controllers/car.controller');

const auth = require('../middleware/auth');

router.get('/', auth, CarController.getCars);
router.post('/', auth, CarController.addCar);
router.delete('/:carid', auth, CarController.deleteCar);

module.exports = router;
