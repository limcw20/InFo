const pool = require("../db/db");

//user creates a post -> create default settings for post and makes user chat superuser
const createUserPost = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { post_title, post_desc, post_img } = req.body;

    // to create as mentioned all in one transaction
    await pool.query("BEGIN");

    // Create chat_settings for the user
    const chatSettingsQuery = await pool.query(
      "INSERT INTO chat_settings (user_id, post_is_public, post_is_locked) VALUES ($1, $2, $3) RETURNING chat_settings_id",
      [user_id, false, false]
    );
    const chatSettingsId = chatSettingsQuery.rows[0].chat_settings_id;

    // Insert post with generated chat_settings_id
    let newPostQuery;
    let newPostId;

    // creating post with image vs no image
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

//get all posts/chat created by user
const getAllPostsByUserId = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { rows } = await pool.query(
      `
      SELECT 
        post.*, 
        chat_settings.post_is_public, 
        chat_settings.post_is_locked, 
        chat_user.is_superuser
      FROM 
        post post
      LEFT JOIN 
        chat_settings chat_settings ON post.chat_settings_id = chat_settings.chat_settings_id
      LEFT JOIN 
        chat_user chat_user ON post.post_id = chat_user.post_id AND chat_user.user_id = $1
      WHERE 
        post.user_id = $1
    `,
      [user_id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// another user joins the chat/post, but need to ensure no duplicate entry
const joinPost = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;

    // Check if the user is already in chatroom
    const { rows } = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM chat_user
      WHERE user_id = $1 AND post_id = $2
    `,
      [user_id, post_id]
    );
    const existingJoinCount = parseInt(rows[0].count);

    if (existingJoinCount > 0) {
      return res
        .status(400)
        .json({ error: "User is already in this chatroom." });
    }

    // Insert a record into the chat_user table to join the user to the chatroom
    await pool.query(
      `
      INSERT INTO chat_user (user_id, post_id, is_superuser)
      VALUES ($1, $2, FALSE)
    `,
      [user_id, post_id]
    );

    res.json({ message: "User joined the post successfully." });
  } catch (error) {
    console.error("Error joining user to post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listOfUserInPost = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const { rows } = await pool.query(
      `SELECT chat_user.user_id, chat_user.is_superuser, users.username, users.nickname
       FROM chat_user
       INNER JOIN users ON chat_user.user_id = users.user_id
       WHERE chat_user.post_id = $1`,
      [post_id]
    ); //include nickname and username for easier reference
    res.json(rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "Error getting user" });
  }
};

const deletePostAsSuperuser = async (req, res) => {
  try {
    const post_id = req.params.post_id;
    const user_id = req.params.user_id;

    // Check if the user is a superuser for the post
    const { rows } = await pool.query(
      `
       SELECT is_superuser
       FROM chat_user
       WHERE user_id = $1 AND post_id = $2
     `,
      [user_id, post_id]
    );

    if (rows.length === 0 || !rows[0].is_superuser) {
      return res
        .status(403)
        .json({ status: "error", msg: "Unauthorized to delete this post" });
    }

    // proceed with delete logic if authorized to do so
    const result = await pool.query("DELETE FROM post WHERE post_id = $1", [
      post_id,
    ]);

    if (result.rowCount === 0) {
      // If no rows were deleted, the post does not exist
      return res.status(404).json({ status: "error", msg: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

module.exports = {
  createUserPost,
  getAllPostsByUserId,
  joinPost,
  listOfUserInPost,
  deletePostAsSuperuser,
};

// create chat response by chat user
