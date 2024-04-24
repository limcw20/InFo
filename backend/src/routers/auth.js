const express = require("express");
const { getAllUsers } = require("../controllers/auth");

const router = express.Router();

router.get("/users", getAllUsers);

module.exports = router;
