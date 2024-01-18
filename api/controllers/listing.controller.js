const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
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
