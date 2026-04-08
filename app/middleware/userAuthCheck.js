const jwt = require("jsonwebtoken");

const authCheck = (req, res, next) => {
  try {
    let token =
      req.body?.token ||
      req.query?.token ||
      req.headers["x-access-token"] ||
      req.headers["authorization"];

    if (!token) {
      return res.status(401).json({
        status: false,
        message: "Token is required",
      });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    } else {
      return res.status(401).json({
        status: false,
        message: "Invalid token format",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      status: false,
      message: "Invalid or expired token",
    });
  }
};

module.exports = authCheck;
