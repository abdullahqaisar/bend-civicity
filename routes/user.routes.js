const express = require('express');

const router = express.Router();

const UserController = require('../controllers/user.controller');

const auth = require('../middleware/auth');

router.get('/', auth, UserController.getUser);
router.get('/completedrides', auth, UserController.getCompletedRides);
router.get('/rides/:id', auth, UserController.getRides);
router.get('/rating', auth, UserController.getDriverRating);
router.patch('/', auth, UserController.updateProfile);
router.patch(
  '/uploadprofilepicture',
  auth,
  UserController.uploadProfilePicture,
);

module.exports = router;
