const pool = require("../db/db");

const createUserPost = async (req, res) => {
  try {
  } catch (error) {
    console.error("Error deleting user category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
// create post (identified post_id) by user -> set host is_superuser = TRUE
// delete post by superuser by post_id (need auth for chat)
// get all post of a user
// chat settings create(tgt with post?) update-> superuser set invisible and islocked
// create chat response by chat user

module.exports = {};
