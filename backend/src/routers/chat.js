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

router.put("/:user_id/post", authUser, createUserPost); // user creates post
router.get("/:user_id", authUser, getAllPostsByUserId); // posts user hosted
router.put("/:user_id/:post_id", authUser, joinPost); // which user joins which chat
router.get("/chatuserlist/:post_id", authUser, listOfUserInPost);
router.delete("/:user_id/:post_id", authUser, authAdmin, deletePostAsSuperuser);

module.exports = router;
