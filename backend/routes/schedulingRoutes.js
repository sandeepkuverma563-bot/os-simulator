const express = require("express");
const router = express.Router();
const { runScheduling, compareScheduling } = require("../controllers/schedulingController");

router.post("/run", runScheduling);
router.post("/compare", compareScheduling);

module.exports = router;
