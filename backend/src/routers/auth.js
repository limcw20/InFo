const express = require("express");
const { getAllUsers, register, login } = require("../controllers/auth");
const { authAdmin, authUser } = require("../middleware/auth");

const router = express.Router();

router.get("/users", getAllUsers);
router.put("/users", register);
router.post("/users", login);

module.exports = router;
