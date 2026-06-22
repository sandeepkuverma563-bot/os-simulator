const express = require("express");
const cors = require("cors");

const schedulingRoutes = require("./routes/schedulingRoutes");
const memoryRoutes = require("./routes/memoryRoutes");
const deadlockRoutes = require("./routes/deadlockRoutes");
const performanceRoutes = require("./routes/performanceRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/scheduling", schedulingRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/deadlock", deadlockRoutes);
app.use("/api/performance", performanceRoutes);

app.get("/", (req, res) => {
  res.json({
    status: "OS Simulator Platform API is running",
    version: "1.0.0",
    modules: ["scheduling", "memory", "deadlock", "performance"],
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found", path: req.originalUrl });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`OS Simulator Platform API running on http://localhost:${PORT}`);
});
