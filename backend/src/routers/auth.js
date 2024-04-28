const express = require("express");
const {
  getAllUsers,
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth");
const { authAdmin, authUser } = require("../middleware/auth");
const {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
} = require("../validators/auth");
const { errorCheck } = require("../validators/errorCheck");

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.put("/users", validateRegistrationData, errorCheck, register);
router.post("/users", validateLoginData, errorCheck, login);
router.post("/users/refresh", validateRefreshToken, errorCheck, refresh);
router.post("/users/logout", authUser, logout);

module.exports = router;
