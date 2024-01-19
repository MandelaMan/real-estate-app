const express = require("express");
const {
  test,
  createListing,
  getListings,
  getListing,
  deleteListing,
  updateListing,
} = require("../controllers/listing.controller.js");
const { verifyToken } = require("../utils/helperFunctions.js");

const router = express.Router();

router.get("/all", getListings);

router.get("/get/:id", getListing);

// Added middleware verifyToken to check whether the token is valid
router.post("/create", verifyToken, createListing);

router.put("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);

module.exports = router;
