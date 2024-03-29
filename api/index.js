const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const listingRoutes = require("./routes/listing.route");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const app = express();

app.use(express.json());

app.use(cookieParser());

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
app.use("/api/listing", listingRoutes);

//This is a middleware that allows us to catch all errors and report
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
