const express = require("express");
const {
  registerUser,
  loginUser,
  getUser,
} = require("../controllers/userController");
const router = express.Router();
const authenticateToken = require("../middlewares/authenticateToken");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user", authenticateToken, getUser);

module.exports = router;
