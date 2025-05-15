const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getUserByEmail,
  updateUser,
  deleteUser,
} = require("../controllers/authController");
const { authMiddleware } = require("../middleware/rotected");
const isAdmin = require("../middleware/isAdmin");
const isManager = require("../middleware/isManager");
const router = express.Router();

router.post("/register", authMiddleware, isAdmin, registerUser);
router.post("/login", loginUser);
router.get("/getAllUsers", authMiddleware, isAdmin, getAllUsers);
router.get("/getUserByEmail", getUserByEmail, authMiddleware, isAdmin);
router.put("/updateUser/:email", updateUser, authMiddleware, isAdmin);
router.delete("/deleteUser/:email", authMiddleware, isAdmin, deleteUser);

module.exports = router;
