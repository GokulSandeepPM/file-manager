const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const logger = require("../utils/logger");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    logger.info(`Attempting login for user: ${email}`);
    const user = await User.findOne({ email });
    if (!user) {
      logger.warn(`Invalid login attempt for email: ${email}`);
      return res.status(400).json({ message: "Invalid user credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      logger.warn(`Invalid password attempt for email: ${email}`);
      return res.status(400).json({ message: "Invalid password credentials" });
    }

    const token = jwt.sign({ id: user._id, roles: user.roles }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info(`User logged in successfully: ${email}`);
    res.status(200).json({ token, roles: user.roles });
  } catch (error) {
    logger.error(`Error during login: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
};
