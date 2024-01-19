const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
  getListings: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit) || 10;

      const startIndex = parseInt(req.query.startIndex) || 0;

      let offer = req.query.offer;

      if (offer == undefined || offer == "false") {
        offer = {
          $in: [false, true],
        };
      }

      let furnished = req.query.furnished;

      if (furnished == undefined || furnished == "false") {
        furnished = {
          $in: [false, true],
        };
      }

      let parking = req.query.parking;

      if (parking == undefined || parking == "false") {
        parking = {
          $in: [false, true],
        };
      }

      let type = req.query.type;

      if (type == undefined || type == "all") {
        type = {
          $in: ["rent", "sale"],
        };
      }

      const searchTerm = req.query.searchTerm || "";

      const sort = req.query.sort || "createdAt";

      const order = req.query.order || "desc";

      const listings = await Listing.find({
        name: { $regex: searchTerm, $options: "i" },
        offer,
        furnished,
        parking,
        type,
      })
        .sort({ [sort]: order })
        .limit(limit)
        .skip(startIndex);

      return res.status(200).json({
        success: true,
        listings,
      });
    } catch (err) {
      return next(errorHandler(500, err.message));
      // err.message;
    }
  },
  getListing: async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);

      return res.status(200).json({
        success: true,
        listing,
      });
    } catch (err) {
      next(errorHandler(500, err.message));
    }
  },
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
