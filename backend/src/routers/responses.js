const express = require("express");
const {
  addResponseToChat,
  getAllResponsesFromPost,
} = require("../controllers/responses");

const router = express.Router();

router.put("/:user_id/:post_id", addResponseToChat);
router.get("/:post_id", getAllResponsesFromPost);

module.exports = router;
