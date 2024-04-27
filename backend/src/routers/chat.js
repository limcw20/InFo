const express = require("express");
const { createUserPost } = require("../controllers/chat");

const router = express.Router();

router.put("/:user_id/post", createUserPost);

module.exports = router;
