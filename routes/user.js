const express = require("express");
const router = express.Router();
const { protect, admin } = require("../middleware/authMiddleware");
const { getMe } = require("../controllers/authController");
const { createUserWithRole, getAllUsers } = require("../controllers/userController");

// @route   GET /api/users/me
// @access  Private
router.get("/me", protect, getMe);

// @route   POST /api/users/create
// @access  Private (Admin only)
router.post("/create", protect, admin, createUserWithRole);

// @route   GET /api/users
// @access  Private (Admin only)
router.get("/", protect, admin, getAllUsers);

module.exports = router;
