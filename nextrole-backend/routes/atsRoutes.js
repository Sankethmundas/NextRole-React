const express = require("express");
const protect = require("../middleware/authMiddleware");
const { saveAtsResult, getAtsResults } = require("../controllers/atsController");

const router = express.Router();

router.get("/", protect, getAtsResults);
router.post("/", protect, saveAtsResult);

module.exports = router;
