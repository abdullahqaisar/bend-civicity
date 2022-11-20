const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  email: {
    type: String,
  },
  firstName: {
    type: String,
  },
  lastName: {
    type: String,
  },
  password: {
    type: String,
  },
});

module.exports = mongoose.model("Admin", Admin);
