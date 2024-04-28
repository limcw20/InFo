const express = require("express");
const {
  addResponseToChat,
  getAllResponsesFromPost,
  deleteResponseFromChat,
} = require("../controllers/responses");
const { authUser } = require("../middleware/auth");
const { validateResponseInPost } = require("../validators/responses");
const { errorCheck } = require("../validators/errorCheck");

const router = express.Router();

router.put(
  "/:user_id/:post_id",
  authUser,
  validateResponseInPost,
  errorCheck,
  addResponseToChat
);
router.get("/:post_id", authUser, getAllResponsesFromPost);
router.delete("/:user_id/:response_id", authUser, deleteResponseFromChat);

module.exports = router;
