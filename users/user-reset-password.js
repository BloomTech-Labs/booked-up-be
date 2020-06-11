const router = require("express").Router();

const {
  validateUserPasswordReset,
  validateUserPasswordRequestReset,
} = require("./user-validation");

const {
  passwordResetRequest,
  passwordGet,
  passwordReset,
} = require("./user-controller");

router.post("/", validateUserPasswordRequestReset, passwordResetRequest);

router.get("/reset/:id/:token", passwordGet);

router.post("/reset/", validateUserPasswordReset, passwordReset);

module.exports = router;
