const pool = require("../db/db");

const addResponseToChat = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;
    const { response_desc, response_img } = req.body;

    // to check if user is in specified post before proceeding
    const userInPostQuery = await pool.query(
      `SELECT COUNT(*) AS count
      FROM chat_user
      WHERE user_id = $1 AND post_id = $2`,
      [user_id, post_id]
    );

    const userInPostCount = parseInt(userInPostQuery.rows[0].count);

    if (userInPostCount === 0) {
      return res
        .status(403)
        .json({ error: "User is not in the specified post" });
    }

    let query;
    let values;

    //respond with vs without image
    if (response_img) {
      query = `
        INSERT INTO response (user_id, post_id, response_desc, response_img, response_date)
        VALUES ($1, $2, $3, $4, CURRENT_DATE)
      `;
      values = [user_id, post_id, response_desc, response_img];
    } else {
      query = `
        INSERT INTO response (user_id, post_id, response_desc, response_date)
        VALUES ($1, $2, $3, CURRENT_DATE)
      `;
      values = [user_id, post_id, response_desc];
    }

    // Execute the query
    await pool.query(query, values);

    res.status(201).json({ message: "Response added successfully" });
  } catch (error) {
    console.error("Error adding response to post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { addResponseToChat };
