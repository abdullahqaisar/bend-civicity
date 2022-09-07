const express = require("express");
const AdminController = require("../controllers/AdminController");

var router = express.Router();

router.post("/signup", AdminController.signup);
router.post("/login", AdminController.login);
router.get("/getallusers", AdminController.getAllUsers);
router.get("/getallrides", AdminController.getAllRides);

module.exports = router;
