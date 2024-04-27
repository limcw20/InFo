const pool = require("../db/db");

const createUserPost = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { post_title, post_desc, post_img } = req.body;

    await pool.query("BEGIN");

    // Create chat_settings entry for the user
    const chatSettingsQuery = await pool.query(
      "INSERT INTO chat_settings (user_id, post_is_public, post_is_locked) VALUES ($1, $2, $3) RETURNING chat_settings_id",
      [user_id, false, false]
    );
    const chatSettingsId = chatSettingsQuery.rows[0].chat_settings_id;

    // Insert post with generated chat_settings_id
    let newPostQuery;
    let newPostId;

    if (post_img) {
      newPostQuery = await pool.query(
        "INSERT INTO post (user_id, chat_settings_id, post_title, post_desc, post_img, post_date) VALUES ($1, $2, $3, $4, $5, CURRENT_DATE) RETURNING post_id",
        [user_id, chatSettingsId, post_title, post_desc, post_img]
      );
    } else {
      newPostQuery = await pool.query(
        "INSERT INTO post (user_id, chat_settings_id, post_title, post_desc, post_date) VALUES ($1, $2, $3, $4, CURRENT_DATE) RETURNING post_id",
        [user_id, chatSettingsId, post_title, post_desc]
      );
    }

    newPostId = newPostQuery.rows[0].post_id;

    // Set the user as superuser for the created post
    await pool.query(
      "INSERT INTO chat_user (user_id, post_id, is_superuser) VALUES ($1, $2, TRUE)",
      [user_id, newPostId]
    );

    // Insert post_id into chat_list
    await pool.query(
      "INSERT INTO chat_list (post_id, user_id) VALUES ($1, $2)",
      [newPostId, user_id]
    );

    await pool.query("COMMIT");

    res
      .status(201)
      .json({ message: "Post created successfully", post_id: newPostId });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { createUserPost };

// create post (identified post_id) by user -> set host is_superuser = TRUE
// delete post by superuser by post_id (need auth for chat)
// get all post of a user
// chat settings create(tgt with post?) update-> superuser set invisible and islocked
// create chat response by chat user
