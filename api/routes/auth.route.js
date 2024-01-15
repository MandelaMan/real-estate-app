const express = require("express");
const {
  createAccount,
  logIn,
  googleAccountCreation,
} = require("../controllers/auth.controller.js");

const router = express.Router();

router.post("/signup", createAccount);
router.post("/signin", logIn);
router.post("/google", googleAccountCreation);

module.exports = router;
