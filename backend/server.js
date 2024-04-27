require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const user = require("./src/routers/users");
const auth = require("./src/routers/auth");
const chat = require("./src/routers/chat");
const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(cors());
app.use(helmet());
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/auth", auth);
app.use("/users", user);
app.use("/chat", chat);

app.listen(5001, () => {
  console.log(`Server started on port 5001`);
});
