const User = require("../models/user.model.js");
const { genSaltSync, hashSync, compareSync, compare } = require("bcrypt");
const { errorHandler } = require("../utils/error.js");

module.exports = {
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
