const express = require("express");

const router = express.Router();

const { createJob, getJobs, updateJob, deleteJob} = require("../controllers/jobController");

const authMiddleware = require("../middleware/authMiddleware");

router.post(
    "/",
    authMiddleware,
    createJob
);
router.get(
    "/",
    authMiddleware,
    getJobs
);
router.put(
    "/:id",
    authMiddleware,
    updateJob
);
router.delete(
    "/:id",
    authMiddleware,
    deleteJob
);

module.exports = router;