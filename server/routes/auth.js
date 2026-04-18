const express       = require("express");
const bcrypt        = require("bcryptjs");
const jwt           = require("jsonwebtoken");
const User          = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ── Helper: generate signed JWT ───────────────
const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ─────────────────────────────────────────────
//  POST /api/auth/signup
// ─────────────────────────────────────────────
router.post("/signup", async (req, res) => {
  try {
    const { name, email, username, password } = req.body;

    // 1. Validate required fields
    if (!name || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. Check for duplicate email
    const emailExists = await User.findOne({ email: email.toLowerCase() });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3. Check for duplicate username
    const usernameExists = await User.findOne({ username: username.toLowerCase() });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // 4. Hash password
    const salt           = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 5. Create user
    const user = await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    // 6. Generate token & respond
    const token = generateToken(user._id);

    return res.status(201).json({
      token,
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        username: user.username,
        bio:      user.bio,
      },
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  POST /api/auth/login
// ─────────────────────────────────────────────
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // 2. Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // 4. Generate token & respond
    const token = generateToken(user._id);

    return res.status(200).json({
      token,
      user: {
        id:       user._id,
        name:     user.name,
        email:    user.email,
        username: user.username,
        bio:      user.bio,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  GET /api/auth/me  (protected)
// ─────────────────────────────────────────────
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    console.error("Get me error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
