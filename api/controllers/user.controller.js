const User = require("../models/user.model.js");
const { errorHandler } = require("../utils/helperFunctions.js");

module.exports = {
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
