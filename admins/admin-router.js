const router = require("express").Router();

const {
  validateUpdatePassword,
  validateUpdateEmail,
} = require("./admin-validation");
const { updatePassword, updateEmail } = require("./admin-controller");

// UPDATE password

router.patch("/:id/updatePass", validateUpdatePassword, updatePassword);

// Update email

router.patch("/:id/email", validateUpdateEmail, updateEmail);

module.exports = router;
