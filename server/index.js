// ─────────────────────────────────────────────
//  DevBoard API — index.js
// ─────────────────────────────────────────────
require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const mongoose = require("mongoose");

// ── Models ────────────────────────────────────
const User    = require("./models/User");
const Project = require("./models/Project");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS — whitelist dev + production origins ─
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,          // set on Render after Vercel deploy
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow server-to-server calls (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());    // Parse incoming JSON bodies

// ── Routes ────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "DevBoard API running" });
});

// ── API Routes ────────────────────────────────
app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// ── MongoDB Connection → Start Server ─────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀  DevBoard server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
