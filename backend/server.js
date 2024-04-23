require("dotenv").config();

const express = require("express");
// connectDB = require('./src/db/db');
const cors = require("cors");
const helmet = require("helmet");

const auth = require("./src/routers/auth");

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

//   connectDB()
const app = express();
