const { LoginFuncDisplay, loginFuncEmail } = require("./login-function");

exports.postLogin = [
  (req, res) => {
    if (req.body.login.indexOf("@") !== -1) {
      loginFuncEmail(req, res);
    } else {
      LoginFuncDisplay(req, res);
    }
  },
];
