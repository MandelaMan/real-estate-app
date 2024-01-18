const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
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
