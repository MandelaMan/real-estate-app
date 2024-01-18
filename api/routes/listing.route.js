const express = require("express");
const {
  test,
  createListing,
  allListings,
} = require("../controllers/listing.controller.js");
const { verifyToken } = require("../utils/helperFunctions.js");

const router = express.Router();

router.get("/test", test);

// Added middleware verifyToken to check whether the token is valid
router.post("/create", verifyToken, createListing);

router.get("/listings/", verifyToken, allListings);

module.exports = router;
