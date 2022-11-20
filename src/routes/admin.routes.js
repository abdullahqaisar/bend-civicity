const express = require("express");
const AdminController = require("../controllers/admin.controller");

var router = express.Router();

router.post("/signup", AdminController.signup);
router.post("/login", AdminController.login);
router.get("/getallusers", AdminController.getAllUsers);
router.get("/getallrides", AdminController.getAllRides);
router.get("/image", AdminController.image);

module.exports = router;
