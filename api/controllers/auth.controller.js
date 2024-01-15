const User = require("../models/user.model.js");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
const { errorHandler } = require("../utils/error.js");
const { sign } = require("jsonwebtoken");

module.exports = {
  logIn: async (req, res, next) => {
    const { email, password } = req.body;

    try {
      const isValidUser = await User.findOne({ email });

      if (!isValidUser) {
        return next(
          errorHandler(
            404,
            "Invalid credentials. Please check and try again..."
          )
        );
      }

      const validPassword = compareSync(
        password.toString(),
        isValidUser.password
      );

      if (!validPassword) {
        return next(
          errorHandler(
            404,
            "Invalid credentials. Please check and try again..."
          )
        );
      }

      const token = sign({ id: isValidUser._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // To return everything else and exclude password
      const { password: pass, ...remaining_info } = isValidUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(remaining_info);
    } catch (err) {
      return next(errorHandler(500, "Internal server error"));
    }
  },
  createAccount: async (req, res, next) => {
    const body = req.body;
    const salt = genSaltSync(10);
    body.password = hashSync(body.password, salt);

    const newUser = new User(body);

    try {
      await newUser.save();

      res.status(201).json({
        message: "User created",
      });
    } catch (err) {
      //   next(errorHandler(505, "error is custom"))
      next(err);
    }
  },
};
