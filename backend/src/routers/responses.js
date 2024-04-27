const express = require("express");
const { addResponseToChat } = require("../controllers/responses");

const router = express.Router();

router.put("/:user_id/:post_id", addResponseToChat);

module.exports = router;
