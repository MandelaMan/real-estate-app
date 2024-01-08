const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const app = express();

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
