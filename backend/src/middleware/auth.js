const jwt = require("jsonwebtoken");
const pool = require("../db/db");

//Auth Token for users when logging in
const authUser = (req, res, next) => {
  if (!("authorization" in req.headers)) {
    return res.status(400).json({ status: "error", msg: "no token found" });
  }

  const token = req.headers["authorization"].replace("Bearer ", "");
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);
      req.decoded = decoded;
      next();
    } catch (error) {
      console.error("Token verification error: ", error.message);
      return res.status(401).json({ status: "error", msg: "unauthorized" });
    }
  } else {
    return res.status(403).json({ status: "error", msg: "missing token" });
  }
};

//Auth Token for admin when logging in
const authAdmin = async (req, res, next) => {
  try {
    if (!("authorization" in req.headers)) {
      return res.status(400).json({ status: "error", msg: "no token found" });
    }

    const token = req.headers["authorization"].replace("Bearer ", "");
    if (!token) {
      return res.status(403).json({ status: "error", msg: "missing token" });
    }

    const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

    // Fetch user information from the database based on the decoded user_id
    const { rows } = await pool.query(
      "SELECT user_id, is_admin FROM users WHERE user_id = $1",
      [decoded.loggedInId]
    );

    // Check if the user is an admin
    if (rows.length > 0 && rows[0].is_admin) {
      req.decoded = decoded;
      next();
    } else {
      res
        .status(403)
        .json({ error: "Access unathorized. Only Admins allowed." });
    }
  } catch (error) {
    console.error(error.message);
    return res.status(401).json({ status: "error", msg: "unauthorized" });
  }
};

module.exports = { authUser, authAdmin };
