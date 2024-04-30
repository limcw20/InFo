const express = require("express");
const {
  getUserByUsername,
  updateUserSettings,
  addUserCategory,
  getUserCategoryDetails,
  deleteUserCategory,
} = require("../controllers/users");
const { authUser, authAdmin } = require("../middleware/auth");
const {
  validateUserSettings,
  validateUpdateUserDetails,
} = require("../validators/users");
const { errorCheck } = require("../validators/errorCheck");

const router = express.Router();

router.get("/:username", authUser, getUserByUsername);
router.patch(
  "/:user_id",
  validateUpdateUserDetails,
  errorCheck,
  authUser,
  updateUserSettings
);
router.put(
  "/:user_id/category",
  authUser,
  validateUserSettings,
  errorCheck,
  addUserCategory
);
router.get("/:user_id/category", authUser, getUserCategoryDetails);
router.delete(
  "/:user_settings_id/:user_id",
  authUser,
  validateUserSettings,
  errorCheck,
  deleteUserCategory
);
module.exports = router;
