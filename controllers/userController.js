const bcrypt = require("bcryptjs");
const User = require("../models/User"); 

// @desc    Create user with specific role (Admin only)
// @route   POST /api/users/create
// @access  Private (Admin)
const createUserWithRole = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Please add all fields" });
    }

    if (!["admin", "doctor", "patient"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can create users with roles" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    console.error("Error creating user with role:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private (Admin)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json({ users }); // ✅ return object with key 'users'
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createUserWithRole,
  getAllUsers, // ✅ export it
};
