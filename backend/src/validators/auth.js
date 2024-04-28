const { body } = require("express-validator");

const validateRegistrationData = [
  body("username", "Username is required").not().isEmpty(),
  body("username", "Username length min is 6 and max is 24").isLength({
    min: 6,
    max: 24,
  }),
  body("password", "Password is required").not().isEmpty(),
  body("password", "Password min is 8 and max is 50").isLength({
    min: 8,
    max: 50,
  }),
  body("nickname", "Nickname is required").not().isEmpty(),
  body("nickname", "Nickname length min of 3 and max of 24").isLength({
    min: 3,
    max: 24,
  }),
  body("first_name", "First name is required").not().isEmpty(),
  body("first_name", "First name max length is 50 characters").isLength({
    max: 50,
  }),
  body(
    "first_name",
    "First name must contain only alphabetic characters"
  ).matches(/^[a-zA-Z]+$/),

  body("last_name", "Last name max length is 50 characters").isLength({
    max: 50,
  }),
  body(
    "last_name",
    "Last name must contain only alphabetic characters"
  ).matches(/^[a-zA-Z]+$/),
];

const validateLoginData = [
  body("username", "username is required").not().isEmpty(),
  body("password", "password is required").not().isEmpty(),
];

const validateRefreshToken = [
  body("refresh", "refresh token is required")
    .not()
    .isEmpty()
    .isLength({ min: 1 }),
];

module.exports = {
  validateRegistrationData,
  validateLoginData,
  validateRefreshToken,
};
