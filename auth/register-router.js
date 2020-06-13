const router = require("express").Router();

const {
  validateRegister,
  validateResendEmail,
} = require("./register-validation");

const {
  register,
  resendRegister,
  getAndConfirmEmail,
} = require("./register-controller");

// Register Post

router.post("/", validateRegister, register);

// Resend email registration link

router.post("/resendConfirm", validateResendEmail, resendRegister);

// Get and confirm resend email

router.get("/confirmation/:token", getAndConfirmEmail);

module.exports = router;
