const express = require("express");
const {
  getAllUsers,
  register,
  login,
  refresh,
} = require("../controllers/auth");
const { authAdmin, authUser } = require("../middleware/auth");

const router = express.Router();

router.get("/users", authAdmin, getAllUsers);
router.put("/users", register);
router.post("/users", login);
router.post("/users/refresh", refresh);

module.exports = router;
