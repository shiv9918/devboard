// ─────────────────────────────────────────────
//  DevBoard API — index.js
// ─────────────────────────────────────────────
require("dotenv").config();

// ── Catch-all for unhandled errors (visible in Render logs) ──────
process.on("uncaughtException",  (err) => { console.error("UNCAUGHT:", err); process.exit(1); });
process.on("unhandledRejection", (err) => { console.error("UNHANDLED:", err); process.exit(1); });

const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");

// ── Startup diagnostics (safe — no secrets printed) ──────────────
console.log("NODE_ENV  :", process.env.NODE_ENV  || "not set");
console.log("PORT      :", process.env.PORT       || "5000 (default)");
console.log("MONGO_URI :", process.env.MONGO_URI  ? "set ✓" : "MISSING ✗");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "set ✓" : "MISSING ✗");

// ── Models ───────────────────────────────────────────────────────
const User    = require("./models/User");
const Project = require("./models/Project");

const app  = express();
const PORT = process.env.PORT || 5000;

// ── CORS — whitelist dev + production origins ─────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin '${origin}' not allowed`));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ message: "DevBoard API running" });
});

app.use("/api/auth",     require("./routes/auth"));
app.use("/api/projects", require("./routes/projects"));

// ── MongoDB Connection → Start Server ────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅  MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀  DevBoard server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌  MongoDB connection failed:", err.message);
    process.exit(1);
  });
