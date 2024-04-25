const express = require("express");
const { getUserByUsername } = require("../controllers/users");

const router = express.Router();

router.post("/:username", getUserByUsername);

module.exports = router;
