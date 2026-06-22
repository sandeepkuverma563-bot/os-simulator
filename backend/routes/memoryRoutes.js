const express = require("express");
const router = express.Router();
const { runPageReplacement } = require("../controllers/memoryController");
const { runAllocation } = require("../controllers/allocationController");

router.post("/page-replacement", runPageReplacement);
router.post("/allocation", runAllocation);

module.exports = router;
