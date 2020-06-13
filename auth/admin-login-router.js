const router = require("express").Router();

const { validateAdminLogin } = require("./admin-login-validation");

const { adminLogin } = require("./admin-login-controller");

router.post("/", validateAdminLogin, adminLogin);

module.exports = router;
