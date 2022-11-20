const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");


require("dotenv").config();

const authRoutes = require("./src/routes/auth.routes");
const userRoutes = require("./src/routes/user.routes");
const rideRoutes = require("./src/routes/ride.routes");
const adminRoutes = require("./src/routes/admin.routes");

mongoose
  .connect(process.env.DATABASE_CONNECTION)
  .then(() => {
    console.log("Server is running on port " + process.env.PORT);
    app.listen(process.env.PORT);
  })
  .catch((err) => {
    console.log(err);
  });


app.use(express.json({limit: '25mb'}));
// app.use(express.urlencoded({limit: '25mb'}));

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ride", rideRoutes);
app.use("/admin", adminRoutes);
