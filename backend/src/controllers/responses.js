const pool = require("../db/db");

const getAllResponsesFromPost = async (req, res) => {
  try {
    const post_id = req.params.post_id;

    const { rows: responses } = await pool.query(
      `SELECT * FROM response WHERE response.post_id = $1 `,
      [post_id]
    );
    const { rows: post } = await pool.query(
      `SELECT * FROM post WHERE post_id = $1`,
      [post_id]
    );

    const { rows: userlist } = await pool.query(
      `SELECT * FROM chat_user WHERE post_id = $1`,
      [post_id]
    );

    res.json({ post: post[0], responses, userlist });
  } catch (error) {
    console.error("Error fetching responses from chat:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addResponseToChat = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const post_id = req.params.post_id;
    const { response_desc, response_img } = req.body;

    // Check if the user adding response is the same as the logged-in user
    if (user_id !== req.decoded.loggedInId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

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

    // const options = {
    //   year: "numeric",
    //   month: "2-digit",
    //   day: "2-digit",
    //   hour: "2-digit",
    //   minute: "2-digit",
    //   second: "2-digit",
    //   hour12: false,
    //   timeZone: "Asia/Singapore",
    // };

    const date = new Date();
    // date.setHours(date.getHours() + 8);
    // const formattedDate = date.toLocaleString("en-US", options);
    // const formattedTimestamp = formattedDate.replace(
    //   /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/,
    //   "$3-$1-$2 $4:$5:$6"
    // );
    // console.log(formattedTimestamp);

    //respond with vs without image
    if (response_img) {
      query = `
        INSERT INTO response (user_id, post_id, response_desc, response_img, response_date)
        VALUES ($1, $2, $3, $4, $5)
      `;
      values = [user_id, post_id, response_desc, response_img, date];
    } else {
      query = `
        INSERT INTO response (user_id, post_id, response_desc, response_date)
        VALUES ($1, $2, $3, $4)
      `;
      values = [user_id, post_id, response_desc, date];
    }

    // Execute the query
    await pool.query(query, values);

    res.status(201).json({ message: "Response added successfully" });
  } catch (error) {
    console.error("Error adding response to post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteResponseFromChat = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const response_id = req.params.response_id;

    // Check if the user updating the category is the same as the logged-in user
    if (user_id !== req.decoded.loggedInId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    const { rows } = await pool.query(
      `
      SELECT user_id
      FROM response
      WHERE response_id = $1
    `,
      [response_id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Response not found" });
    }

    const response_user_id = rows[0].user_id;

    if (response_user_id !== user_id) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this response" });
    }

    await pool.query("DELETE FROM response WHERE response_id = $1", [
      response_id,
    ]);

    res.json({ message: "Response deleted successfully" });
  } catch (error) {
    console.error("Error deleting response:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  addResponseToChat,
  getAllResponsesFromPost,
  deleteResponseFromChat,
};
