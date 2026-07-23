const express = require("express");
const protect = require("../middleware/authMiddleware");

const {
    registerUser,
    loginUser,
    googleLogin
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

router.post("/google", googleLogin);

module.exports = router;