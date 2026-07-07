const express = require("express");
const protect = require("../middleware/authMiddleware");
const { saveResume, getResume } = require("../controllers/resumeController");

const router = express.Router();

router.get("/", protect, getResume);
router.post("/", protect, saveResume);

module.exports = router;
