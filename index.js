const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

require("dotenv").config();

const authRoutes = require("./src/routes/auth");
const userRoutes = require("./src/routes/user");
const rideRoutes = require("./src/routes/ride");
const adminRoutes = require("./src/routes/admin");

mongoose
  .connect(process.env.DATABASE_CONNECTION)
  .then(() => {
    console.log("Server is running on port " + process.env.PORT);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ride", rideRoutes);
app.use("/admin", adminRoutes);
