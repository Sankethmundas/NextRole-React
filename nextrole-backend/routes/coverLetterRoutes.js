const express = require("express");
const protect = require("../middleware/authMiddleware");
const { saveCoverLetter, getCoverLetter } = require("../controllers/coverLetterController");

const router = express.Router();

router.get("/", protect, getCoverLetter);
router.post("/", protect, saveCoverLetter);

module.exports = router;
