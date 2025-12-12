// server.js - main Express app for all PDF tools

const express = require("express");
const cors = require("cors");
const path = require("path");

// Routes
const organizeRoutes = require("./routes/organizeRoutes");
const optimizeRoutes = require("./routes/optimizeRoutes");
const convertRoutes = require("./routes/convertRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

app.use((req, res, next) => {
  console.time('total');  // Performance measure
  res.on('finish', () => console.timeEnd('total'));
  next();
});

// ----- Common setup -----
app.use(cors());
app.use(express.json());

// ----- Health check -----
app.get("/api/health", (req, res) => {
  res.json({ ok: true, environment: process.env.NODE_ENV || 'development' });
});

// ----- API Routes -----
app.use("/api", organizeRoutes); // /api/merge
app.use("/api", optimizeRoutes); // /api/compress
app.use("/api", convertRoutes);  // /api/pdf-to-word

// ----- Start server -----
app.listen(PORT, () => {
  console.log(`PDFCraft backend running on http://localhost:${PORT}`);
});
