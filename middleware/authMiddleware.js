const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (require authentication)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // ✅ Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // ✅ Attach user (without password) to req
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      return next();
    } catch (error) {
      console.error("Auth error:", error);

      if (error.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token expired, please login again" });
      }

      return res.status(401).json({ message: "Not authorized, invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

// Admin-only access
const admin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as admin" });
};

// Doctor OR Admin access
const doctorOrAdmin = (req, res, next) => {
  if (req.user?.role === "doctor" || req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Not authorized as doctor or admin" });
};

module.exports = { protect, admin, doctorOrAdmin };
