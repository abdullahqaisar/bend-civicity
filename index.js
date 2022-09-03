const express = require("express");
const cors = require("cors");
const app = express();
const moongose = require("mongoose");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const rideRoutes = require("./routes/ride");

const CONNECTION_STRING = "mongodb://localhost:27017";
const PORT = process.env.PORT || 5000;

moongose
  .connect(CONNECTION_STRING)
  .then((result) => {
    console.log("Server is running on port " + PORT);
    app.listen(PORT);
  })
  .catch((err) => {
    console.log(err);
  });

app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/ride", rideRoutes);
