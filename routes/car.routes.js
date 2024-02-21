const express = require('express');

const router = express.Router();

const CarController = require('../controllers/car.controller');

const auth = require('../middleware/auth');

module.exports = router;
