const express = require("express");
const router = express.Router();
const { login, checkAuth, logout } = require("../controllers/authControllers.js");

router.post("/login", login);
router.get("/check-auth", checkAuth);
router.post("/logout", logout);

module.exports = router;