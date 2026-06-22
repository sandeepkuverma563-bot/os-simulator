const express = require("express");
const router = express.Router();
const { generatePerformanceTest } = require("../controllers/performanceController");

router.post("/generate", generatePerformanceTest);

module.exports = router;
