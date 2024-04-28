const express = require("express");
const {
  createUserPost,
  getAllPostsByUserId,
  joinPost,
  listOfUserInPost,
  deletePostAsSuperuser,
  deleteUserFromPostAsSuperuser,
} = require("../controllers/chat");
const { authUser, authAdmin } = require("../middleware/auth");
const { errorCheck } = require("../validators/errorCheck");
const { validateBodyInPost } = require("../validators/chat");
const router = express.Router();

router.put(
  "/:user_id/post",
  authUser,
  validateBodyInPost,
  errorCheck,
  createUserPost
); // user creates post
router.get("/:user_id", authUser, getAllPostsByUserId); // posts user hosted
router.put("/:user_id/:post_id", authUser, joinPost); // which user joins which chat
router.get("/chatuserlist/:post_id", authUser, listOfUserInPost);
router.delete("/:user_id/:post_id", authUser, deletePostAsSuperuser);
router.delete(
  "/:user_id/:post_id/:target_user_id",
  authUser,
  deleteUserFromPostAsSuperuser
);

module.exports = router;
