const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
  userListings,
  userDetails,
} = require("../controllers/user.controller.js");
const { verifyToken } = require("../utils/helperFunctions.js");

const router = express.Router();

router.get("/test", test);

// Added middleware verifyToken to check whether the token is valid
router.put("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, userListings);
router.get("/:id", verifyToken, userDetails);

module.exports = router;
