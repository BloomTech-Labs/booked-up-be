const jwt = require("jsonwebtoken");
const secrets = require("../config/secrets.js");

function genToken(user) {
  const payload = {
    userid: user.id,
    userType: [`${user.user_type}`],
  };

  const options = {
    expiresIn: "8h",
  };

  const token = jwt.sign(payload, secrets.jwtSecret, options);

  return token;
}

module.exports = {
  genToken,
};
