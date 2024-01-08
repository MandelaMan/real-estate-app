const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");

require("dotenv").config();

const app = express();

app.use(express.json());

mongoose
  .connect(process.env.MONGO)
  .then(() => {
    console.log("Connected");
  })
  .catch(() => {
    console.log("Error with connection ");
  });

app.listen(3000, () => {
  console.log("Server is up and running " + 3000);
});

app.use("/api/user", userRoutes);

app.use("/api/auth", authRoutes);
