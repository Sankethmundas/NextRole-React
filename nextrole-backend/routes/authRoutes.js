const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser
} = require("../controllers/authController");

const router = express.Router();

router.get(
    "/profile",
    protect,
    (req, res) => {

        res.json({
            message: "Protected Route",
            userId: req.user
        });

    }
);

router.post("/register", registerUser);

router.post("/login", loginUser);

module.exports = router;