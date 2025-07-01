const { body, validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");

// Register form validation
const validateRegister = [
  body("Username")
    .isAlphanumeric()
    .withMessage("Must be alphanumeric")
    .isLength({ min: 3, max: 30 })
    .withMessage("Username must be between 3 and 30 characters"),
  body("email")
    .isEmail()
    .withMessage("Should be a correct email"),
  body("password")
    .isLength({ min: 4 })
    .withMessage("At least 4 characters"),
  
  // Middleware to check validation results
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = validateRegister;
