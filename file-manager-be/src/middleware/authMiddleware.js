const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    logger.warn("Authorization token missing");
    return res.status(401).json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    logger.info(`Authentication successful for user ID: ${decoded.id}`);
    next();
  } catch (error) {
    logger.error(`Authentication failed: ${error.message}`);
    res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authMiddleware;