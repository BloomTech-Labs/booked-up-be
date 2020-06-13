const router = require("express").Router();

const { validateLogin } = require("./login-validation");

const { postLogin } = require("./login-controller");

// Login using email or display_name

router.post("/", validateLogin, postLogin);

module.exports = router;
