const { body } = require("express-validator");

const validateUserSettings = [
  body("category", "category is required").not().isEmpty(),
  body(
    "category",
    "category must be a minimum of 3 and maximum of 24 characters"
  ).isLength({
    min: 3,
    max: 24,
  }),
  body("sub_category", "category is required").not().isEmpty(),
  body(
    "sub_category",
    "sub-category must be a minimum of 3 and maximum of 24 characters"
  ).isLength({
    min: 3,
    max: 24,
  }),
];

const validateUpdateUserDetails = [
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
  body("gender", "gender can only be male, female, or others")
    .isString()
    .matches(/^(male|female|others)$/),
];

module.exports = { validateUserSettings, validateUpdateUserDetails };
