const User = require("../models/userModel");
const logger = require("../utils/logger");

// Create a new user
const createUser = async (req, res) => {
  try {
    const { email, password, roles, username } = req.body;
    logger.info(`creating new user with email : ${email}`);
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      logger.warn(`User alredy exist for email: ${email}`);
      return res.status(400).json({ message: "Email already exists!" });
    }

    // Proceed to create new user
    const user = new User({
      email,
      password,
      roles,
      username,
    });
    
    await user.save();
    logger.info(`New user created with email : ${email}`);
    res.status(201).json(user);
  } catch (error) {
    logger.error(`Error creating users: ${error.message}`);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users
const getUsers = async (req, res) => {
  try {
    logger.info("Fetching all users...");
    const users = await User.find();
    logger.info(`Fetched ${users.length} users`);
    res.json(users);
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch users", error });
  }
};

// Get a single user by ID
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Fetching user by ID: ${id}`);
    const user = await User.findById(id);

    if (!user) {
      logger.warn(`User not found for ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }
    logger.info(`User found: ${user.email}`);
    res.status(200).json(user);
  } catch (error) {
    logger.error(`Error fetching user by ID: ${error.message}`);
    res.status(500).json({ message: "Failed to fetch user", error });
  }
};

// Update a user by ID
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Updating user with ID: ${id}`);
    const { email, roles } = req.body;

    const user = await User.findById(id);
    if (!user) {
      logger.warn(`User not found for ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Update user properties
    if (email) user.email = email;
    if (roles) user.roles = roles;

    await user.save();
    logger.info(`User updated successfully: ${user.email}`);
    res.status(200).json({ message: "User updated successfully", user });
  } catch (error) {
    logger.error(`Error updating user: ${error.message}`);
    res.status(500).json({ message: "Failed to update user", error });
  }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    logger.info(`Deleting user with ID: ${id}`);
    
    const user = await User.findById(id);
    if (!user) {
      logger.warn(`User not found for ID: ${id}`);
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne({ _id: req.params.id });
    logger.info(`User deleted successfully: ${user.email}`);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error(`Error deleting user: ${error.message}`);
    res.status(500).json({ message: "Failed to delete user", error });
  }
};

module.exports = { createUser, getUsers, getUserById, updateUser, deleteUser };