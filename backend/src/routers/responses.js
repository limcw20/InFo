const express = require("express");
const {
  addResponseToChat,
  getAllResponsesFromPost,
  deleteResponseFromChat,
} = require("../controllers/responses");

const router = express.Router();

router.put("/:user_id/:post_id", addResponseToChat);
router.get("/:post_id", getAllResponsesFromPost);
router.delete("/:user_id/:response_id", deleteResponseFromChat);

module.exports = router;
