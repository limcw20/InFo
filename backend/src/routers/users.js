const express = require("express");
const {
  getUserByUsername,
  updateUserSettings,
  addUserCategory,
  getUserCategoryDetails,
  deleteUserCategory,
} = require("../controllers/users");
const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/:username", authUser, getUserByUsername);
router.patch("/:user_id", authUser, updateUserSettings);
router.put("/:user_id/category", authUser, addUserCategory);
router.get("/:user_id/category", authUser, getUserCategoryDetails);
router.delete("/:user_settings_id/:user_id", authUser, deleteUserCategory);
module.exports = router;
