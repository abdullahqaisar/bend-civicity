const mongoose = require("mongoose");

const Admin = new mongoose.Schema({
  Email: {
    type: String,
  },
  FirstName: {
    type: String,
  },
  LastName: {
    type: String,
  },
  Password: {
    type: String,
  },
});

module.exports = mongoose.model("Admin", Admin);
