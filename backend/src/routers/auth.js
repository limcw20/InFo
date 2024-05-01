const express = require("express");
const {
  getAllUsers,
  register,
  login,
  refresh,
  logout,
  getAllUserPosts,
  deleteOnePost,
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
router.get("/posts", authAdmin, getAllUserPosts);
router.put("/users", validateRegistrationData, errorCheck, register);
router.post("/users", validateLoginData, errorCheck, login);
router.post("/users/refresh", validateRefreshToken, errorCheck, refresh);
router.post("/users/logout", authUser, logout);
router.delete("/posts/:post_id", authAdmin, deleteOnePost);

module.exports = router;
