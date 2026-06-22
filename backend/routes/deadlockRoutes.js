const express = require("express");
const router = express.Router();
const { runBankers } = require("../controllers/deadlockController");

router.post("/bankers", runBankers);

module.exports = router;
