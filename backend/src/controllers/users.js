const pool = require("../db/db");

const getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const { rows } = await pool.query(
      `SELECT *, user_settings.category, user_settings.sub_category
    FROM users
    LEFT JOIN user_settings ON users.user_id = user_settings.user_id
    WHERE users.username = $1`,
      [username]
    );
    console.log(rows);
    // If no user found with the given username
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "Error getting user" });
  }
};

module.exports = { getUserByUsername };
