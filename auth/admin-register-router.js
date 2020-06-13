const router = require("express").Router();

const {
  validateRegister,
  validatePasswordReset,
} = require("./admin-register-validation");

const {
  register,
  registerSetPassword,
  registerPasswordReset,
} = require("./admin-register-controller");

router.post("/", validateRegister, register);

router.get("/reset/:id/:token", registerSetPassword);

router.post(
  "/adminpasswordreset/",
  validatePasswordReset,
  registerPasswordReset
);

module.exports = router;
