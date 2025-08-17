// middleware/tokenAuthenticator.js
const jwt = require("jsonwebtoken");
const { User } = require("../model"); 

const tokenAuthenticator = async (req, res, next) => {
  try {
    const bearer = req.headers["authorization"];
    const token = req.cookies?.jwt || (bearer && bearer.split(" ")[1]);

    if (!token) {
      const err = new Error("No token provided");
      err.statusCode = 401;
      return next(err);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username
    };

    next();
  } catch (error) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 403;
    return next(err);
  }
};

module.exports = tokenAuthenticator;
