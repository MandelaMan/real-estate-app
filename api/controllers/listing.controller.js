const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
  createListing: async (req, res, next) => {
    try {
      const listing = Listing.create(req.body);

      return res.status(201).json(listing);
    } catch (err) {
      next(err);
    }
  },
  test: (req, res) => {
    res.json({
      message: "ok",
    });
  },
};
