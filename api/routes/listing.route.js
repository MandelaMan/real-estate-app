const express = require("express");
const {
  test,
  createListing,
  allListings,
  getListing,
  deleteListing,
  updateListing,
} = require("../controllers/listing.controller.js");
const { verifyToken } = require("../utils/helperFunctions.js");

const router = express.Router();

router.get("/test", test);

router.get("/:id", getListing);

// Added middleware verifyToken to check whether the token is valid
router.post("/create", verifyToken, createListing);
router.get("/listings/", verifyToken, allListings);

router.put("/update/:id", verifyToken, updateListing);
router.delete("/delete/:id", verifyToken, deleteListing);

module.exports = router;
