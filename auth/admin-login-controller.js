const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const secrets = require("../config/secrets.js");
const Admins = require("../admins/admin-model");

exports.adminLogin = [
  (req, res) => {
    const { email, password } = req.body;
    Admins.findBy({ email })
      .first()
      .then((u) => {
        if (u && bcrypt.compareSync(password, u.password)) {
          const token = genToken(u);

          res.status(200).json({
            message: `Welcome back ${u.first_name}`,
            token,
          });
        } else {
          res.status(401).json({ message: "Invalid credentials" });
        }
      })
      .catch((err) => {
        res.status(500).json(err.message);
      });
  },
];

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
