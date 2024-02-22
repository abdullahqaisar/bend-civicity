const express = require('express');
const AdminController = require('../controllers/admin.controller');

const router = express.Router();

const auth = require('../middleware/auth');

router.post('/signup', auth, AdminController.signup);
router.post('/login', auth, AdminController.login);
router.get('/', auth, AdminController.getAllUsers);
router.get('/rides', auth, AdminController.getAllRides);

module.exports = router;
