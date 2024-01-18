const { verify } = require("jsonwebtoken");

module.exports = {
  errorHandler: (statusCode, message) => {
    const error = new Error();

    error.statusCode = statusCode;
    error.message = message;

    return error;
  },
  verifyToken: (req, res, next) => {
    const token = req.cookies.access_token;

    if (!token) {
      return next(this.errorHandler(403, err.message));
    }

    verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return next(this.errorHandler(403, err.message));

      req.user = user;

      next();
    });
  },
};
