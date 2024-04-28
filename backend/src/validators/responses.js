const { body } = require("express-validator");

const validateResponseInPost = [
  body("response_desc", "Description is required").not().isEmpty(),
  body(
    "response_desc",
    "Description must have a minimum of 1 and maximum of 1000 characters"
  ).isLength({
    min: 1,
    max: 1000,
  }),
];

module.exports = {
  validateResponseInPost,
};
