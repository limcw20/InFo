const express = require("express");
const {
  getUserByUsername,
  updateUserSettings,
  addUserCategory,
  getUserCategoryDetails,
  deleteUserCategory,
} = require("../controllers/users");

const router = express.Router();

router.post("/:username", getUserByUsername);
router.patch("/:user_id", updateUserSettings);
router.put("/:user_id/category", addUserCategory);
router.get("/:user_id/category", getUserCategoryDetails);
router.delete("/:user_settings_id/category", deleteUserCategory);
module.exports = router;
