const express = require("express");
const {
  createUserPost,
  getAllPostsByUserId,
  joinPost,
  listOfUserInPost,
  deletePostAsSuperuser,
} = require("../controllers/chat");
const { authUser, authAdmin } = require("../middleware/auth");

const router = express.Router();

router.put("/:user_id/post", createUserPost); // user creates post
router.get("/:user_id", getAllPostsByUserId); // posts user hosted
router.put("/:user_id/:post_id", joinPost); // which user joins which chat
router.get("/chatuserlist/:post_id", listOfUserInPost);
router.delete("/:user_id/:post_id", deletePostAsSuperuser, authUser, authAdmin);

module.exports = router;
