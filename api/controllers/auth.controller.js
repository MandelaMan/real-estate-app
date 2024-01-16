const User = require("../models/user.model.js");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
const { errorHandler } = require("../utils/helperFunctions.js");
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
  googleAccountCreation: async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });

      if (user) {
        const token = sign({ id: user._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // To return everything else and exclude password
        const { password: pass, ...remaining_info } = user._doc;

        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(remaining_info);
      } else {
        const generated_password =
          Math.random().toString(36).slice(-8) +
          Math.random().toString(36).slice(-8);

        const salt = genSaltSync(10);
        const hashed_password = hashSync(generated_password, salt);

        const newUser = new User({
          username:
            req.body.name.split(" ").join("").toLowerCase() +
            Math.random().toString(36).slice(-3),
          email: req.body.email,
          password: hashed_password,
          avatar: req.body.photo,
        });

        await newUser.save();

        const token = sign({ id: newUser._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        // To return everything else and exclude password
        const { password: pass, ...remaining_info } = newUser._doc;

        res
          .cookie("access_token", token, { httpOnly: true })
          .status(200)
          .json(remaining_info);
      }
    } catch (err) {
      return next(
        errorHandler(
          500,
          // "Error with authentication. Please try again later..."
          err.message
        )
      );
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
