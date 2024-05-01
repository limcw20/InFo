const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const getAllUsers = async (req, res) => {
  try {
    try {
      const result = await pool.query("SELECT * FROM users");
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

const getAllUserPosts = async (req, res) => {
  try {
    try {
      const result =
        await pool.query(`SELECT post.*, users.username, users.nickname
      FROM post
      JOIN users ON post.user_id = users.user_id;
      `);
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ status: "error", msg: "error getting users" });
  }
};

const register = async (req, res) => {
  try {
    // Check if username already exists
    const usernameQuery = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username]
    );
    if (usernameQuery.rows.length > 0) {
      return res
        .status(400)
        .json({ status: "error", msg: "Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.user_password, 12);

    // If username is unique, insert the new user into the database
    const insertQuery =
      "INSERT INTO users (username, user_password, first_name, last_name, nickname) VALUES ($1, $2, $3, $4, $5)";
    await pool.query(insertQuery, [
      req.body.username,
      hashedPassword,
      req.body.first_name,
      req.body.last_name,
      req.body.nickname,
    ]);

    return res
      .status(200)
      .json({ status: "success", msg: "User registered successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res
      .status(500)
      .json({ status: "error", msg: "Internal server error" });
  }
};

const deleteOnePost = async (req, res) => {
  try {
    const { post_id } = req.params;

    const result = await pool.query(
      `
      DELETE FROM post
      WHERE post_id = $1
`,
      [post_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const login = async (req, res) => {
  try {
    // Check if user with the provided username exists
    const userQuery = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [req.body.username]
    );
    const user = userQuery.rows[0];
    if (!user) {
      return res
        .status(400)
        .json({ status: "error", msg: "username or password is incorrect" });
    }

    // Compare the provided password with the hashed password stored in the database
    const result = await bcrypt.compare(
      req.body.user_password,
      user.user_password
    );
    if (!result) {
      console.error("Email or password is incorrect");
      return res.status(401).json({ status: "error", msg: "Login failed" });
    }

    // Generate access and refresh tokens
    const claims = {
      username: user.username,
      role: user.is_admin,
      loggedInId: user.user_id,
    };

    //update last_online when user logs in, strangely it's 1 day behind without INTERVAL '1 day'
    const updateLastOnlineQuery =
      "UPDATE users SET last_online = CURRENT_TIMESTAMP AT TIME ZONE 'UTC+8' + INTERVAL '1 day' WHERE user_id = $1";
    await pool.query(updateLastOnlineQuery, [user.user_id]);

    const access = jwt.sign(claims, process.env.ACCESS_SECRET, {
      expiresIn: "20m",
      jwtid: uuidv4(),
    });

    const refresh = jwt.sign(claims, process.env.REFRESH_SECRET, {
      expiresIn: "30d",
      jwtid: uuidv4(),
    });

    res.json({ access, refresh });
  } catch (error) {
    console.error(error.message);
    return res.status(400).json({ status: "error", msg: "Login failed" });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    res.status(200).json({ status: "success", msg: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

const refresh = async (req, res) => {
  try {
    const refreshToken = req.body.refreshToken;

    // Verify the refresh token
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, decoded) => {
      if (err) {
        console.error("Error:", err.message);
        return res
          .status(401)
          .json({ status: "error", msg: "Invalid refresh token" });
      }

      // Extract claims from the refresh token
      const { username, is_admin, loggedInId } = decoded;

      // Generate a new access token
      const newAccessToken = jwt.sign(
        { username, is_admin, loggedInId },
        process.env.ACCESS_SECRET,
        {
          expiresIn: "20m",
          jwtid: uuidv4(),
        }
      );

      res.json({ access: newAccessToken });
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ status: "error", msg: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getAllUserPosts,
  deleteOnePost,
  register,
  login,
  refresh,
  logout,
};
