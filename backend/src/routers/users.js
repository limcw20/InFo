const express = require("express");
const {
  updateUserSettings,
  addUserCategory,
  getUserCategoryDetails,
  deleteUserCategory,
  getUserByUserId,
} = require("../controllers/users");
const { authUser } = require("../middleware/auth");
const {
  validateUserSettings,
  validateUpdateUserDetails,
} = require("../validators/users");
const { errorCheck } = require("../validators/errorCheck");

const router = express.Router();

router.get("/:user_id", authUser, getUserByUserId);
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

  deleteUserCategory
);
module.exports = router;
