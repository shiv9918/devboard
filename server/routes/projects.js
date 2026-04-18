const express        = require("express");
const Project        = require("../models/Project");
const User           = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ── Helper: normalize techStack input ─────────
// Accepts either a comma-separated string or an array
const normalizeTechStack = (techStack) => {
  if (!techStack) return [];
  if (Array.isArray(techStack)) return techStack.map((t) => t.trim()).filter(Boolean);
  return techStack.split(",").map((t) => t.trim()).filter(Boolean);
};

// ─────────────────────────────────────────────
//  GET /api/projects
//  Get all projects belonging to logged-in user
// ─────────────────────────────────────────────
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json(projects);
  } catch (err) {
    console.error("Get projects error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  POST /api/projects
//  Create a new project for logged-in user
// ─────────────────────────────────────────────
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;

    // Validate required field
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }

    const project = await Project.create({
      userId:      req.user.id,
      title:       title.trim(),
      description: description || "",
      techStack:   normalizeTechStack(techStack),
      githubLink:  githubLink  || "",
      liveLink:    liveLink    || "",
    });

    return res.status(201).json(project);
  } catch (err) {
    console.error("Create project error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  PUT /api/projects/:id
//  Update a project (owner only)
// ─────────────────────────────────────────────
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink } = req.body;

    // Build update object with only provided fields
    const updateFields = {};
    if (title       !== undefined) updateFields.title       = title.trim();
    if (description !== undefined) updateFields.description = description;
    if (techStack   !== undefined) updateFields.techStack   = normalizeTechStack(techStack);
    if (githubLink  !== undefined) updateFields.githubLink  = githubLink;
    if (liveLink    !== undefined) updateFields.liveLink    = liveLink;

    // Find by _id AND userId to ensure ownership
    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: updateFields },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (err) {
    console.error("Update project error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  DELETE /api/projects/:id
//  Delete a project (owner only)
// ─────────────────────────────────────────────
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    // Find by _id AND userId to ensure ownership
    const project = await Project.findOneAndDelete({
      _id:    req.params.id,
      userId: req.user.id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error("Delete project error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

// ─────────────────────────────────────────────
//  GET /api/projects/user/:username
//  PUBLIC — fetch a user's profile + projects
// ─────────────────────────────────────────────
router.get("/user/:username", async (req, res) => {
  try {
    // Find the user by username
    const user = await User.findOne({
      username: req.params.username.toLowerCase(),
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch all their projects, newest first
    const projects = await Project.find({ userId: user._id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      user: {
        name:     user.name,
        username: user.username,
        bio:      user.bio,
        avatar:   user.avatar,
      },
      projects,
    });
  } catch (err) {
    console.error("Public profile error:", err.message);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
