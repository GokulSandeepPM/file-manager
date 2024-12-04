const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, getUsers); 
router.get("/:id", authMiddleware, getUserById); 
router.post("/", authMiddleware, createUser); 
router.put("/:id", authMiddleware, updateUser); 
router.delete("/:id", authMiddleware, deleteUser); 

module.exports = router;