const User = require("../models/user.model.js");
const Listing = require("../models/listing.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
  userListings: async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "Forbidden"));
    }

    try {
      const listings = await Listing.find({
        userRef: req.params.id,
      });

      res.status(200).json({
        success: true,
        listings,
      });
    } catch (err) {
      return next(errorHandler(403, err.message));
    }
  },
  deleteUser: async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "Forbidden"));
    }

    try {
      await User.findByIdAndDelete(req.params.id);

      res.clearCookie("access_token");

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (err) {
      next(errorHandler(500, "Failed to delete user"));
    }
  },
  updateUser: async (req, res, next) => {
    if (req.user.id !== req.params.id) {
      return next(errorHandler(403, "Forbidden"));
    }

    try {
      if (req.body.password) {
        const salt = genSaltSync(10);
        req.body.password = hashSync(req.body.password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.username,
            avatar: req.body.avatar,
          },
        },
        { new: true } // the new allows us to return updated user information
      );

      const { password, ...remaining } = updatedUser._doc;

      return res.status(200).json({
        success: true,
        message: "Updated successfully",
        user: remaining,
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
