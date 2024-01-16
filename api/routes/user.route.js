const express = require("express");
const { test, updateUser } = require("../controllers/user.controller.js");
const { verifyToken } = require("../utils/helperFunctions.js");

const router = express.Router();

router.get("/test", test);

// Added middleware verifyToken to check whether the token is valid
router.put("/update/:id", verifyToken, updateUser);

module.exports = router;
