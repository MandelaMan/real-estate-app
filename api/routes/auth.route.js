const express = require("express");
const { createAccount, logIn } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", createAccount);
router.post("/signin", logIn);

module.exports = router;
