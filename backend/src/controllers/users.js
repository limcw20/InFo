const pool = require("../db/db");

const getUserByUserId = async (req, res) => {
  try {
    const userId = req.params.user_id;
    const { rows } = await pool.query(
      `SELECT * FROM users
       WHERE users.user_id = $1`,
      [userId]
    );

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

const updateUserSettings = async (req, res) => {
  try {
    const user_id = req.params.user_id;

    // Check if the user updating the category is the same as the logged-in user
    if (user_id !== req.decoded.loggedInId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await pool.query(
      `UPDATE users
      SET nickname = $1,
          first_name = $2,
          last_name = $3,
          gender = $5
      WHERE user_id = $4`,
      [
        req.body.nickname,
        req.body.first_name,
        req.body.last_name,
        user_id,
        req.body.gender,
      ]
    );

    res.status(200).json({ message: "User settings updated successfully" });
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const addUserCategory = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    // Check if the user adding the category is the same as the logged-in user
    if (user_id !== req.decoded.loggedInId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    await pool.query(
      `INSERT INTO user_settings (user_id, category, sub_category) VALUES ($1, $2, $3)`,
      [user_id, req.body.category, req.body.sub_category]
    );

    res.status(200).json({ message: "User settings updated successfully" });
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getUserCategoryDetails = async (req, res) => {
  try {
    const user_id = req.params.user_id;
    const { rows } = await pool.query(
      `SELECT users.username, user_settings.category, user_settings.sub_category, user_settings.user_settings_id
            FROM users
            LEFT JOIN user_settings ON users.user_id = user_settings.user_id
            WHERE user_settings.user_id = $1`,
      [user_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", msg: "User not found" });
    }
    res.json(rows);
  } catch (error) {
    console.error("Error updating user settings:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUserCategory = async (req, res) => {
  try {
    const user_settings_id = req.params.user_settings_id;
    const user_id = req.params.user_id;

    // to check if it's the logged in / authenticated user before deleting

    if (user_id !== req.decoded.loggedInId) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // to check if it's the logged in / authenticated user (id check)
    const authUserSettings = await pool.query(
      `SELECT user_id FROM user_settings WHERE user_settings_id = $1`,
      [user_settings_id]
    );

    if (authUserSettings.rowCount === 0) {
      return res.status(404).json({ error: "Category not found" });
    }

    const auth_user_id = authUserSettings.rows[0].user_id;

    if (auth_user_id !== user_id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    // Delete the entry from user_settings table based on user_settings_id
    const result = await pool.query(
      `DELETE FROM user_settings WHERE user_settings_id = $1`,
      [user_settings_id]
    );

    if (result.rowCount === 0) {
      // If no rows were deleted, return 404 indicating no such category found
      return res.status(404).json({ error: "Category not found" });
    }

    // If deletion was successful, return success message
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting user category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getUserByUserId,
  updateUserSettings,
  addUserCategory,
  getUserCategoryDetails,
  deleteUserCategory,
};
