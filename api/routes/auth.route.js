const express = require("express");
const { createAccount } = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", createAccount);

module.exports = router;
