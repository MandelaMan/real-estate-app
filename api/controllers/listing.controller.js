const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
  updateListing: async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(401, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(403, "You are not authorized"));
    }

    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true } // the new allows us to return updated user information
      );

      return res.status(200).json({
        success: true,
        message: "Updated successfully",
        listing: updatedListing,
      });
    } catch (err) {
      return next(errorHandler(403, err.message));
    }
  },
  deleteListing: async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(401, "Listing not found"));
    }

    if (req.user.id !== listing.userRef) {
      return next(errorHandler(403, "You are not authorized"));
    }

    try {
      await Listing.findByIdAndDelete(req.params.id);

      res.status(200).json({
        success: true,
        message: "Listing deleted successfully",
      });
    } catch (err) {
      return next(errorHandler(403, err.message));
    }
  },
  allListings: async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "Forbidden"));
    }

    try {
      // const listing = await Listing.findById();
    } catch (err) {
      return next(errorHandler(500, err.message));
    }
  },
  createListing: async (req, res, next) => {
    try {
      const listing = await Listing.create(req.body);

      return res.status(201).json({
        success: true,
        listing,
      });
    } catch (err) {
      return next(errorHandler(500, err.message));
    }
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
