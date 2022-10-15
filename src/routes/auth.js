const express = require("express");
const AuthController = require("../controllers/AuthController");

var router = express.Router();

router.post("/signup", AuthController.signup);
router.post("/checkaccount", AuthController.checkAccount);

// router.post("/getotp", AuthController.getOtp);
// router.post("/verifyotp", AuthController.verifyOtp);

module.exports = router;
