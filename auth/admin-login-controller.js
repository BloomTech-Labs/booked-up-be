const bcrypt = require("bcryptjs");
const Admins = require("../admins/admin-model");

const { genToken } = require("./generate-token");

// (u && bcrypt.compareSync(password, u.password))

exports.adminLogin = [
  (req, res) => {
    const { email, password } = req.body;
    Admins.findBy({ email })
      .first()
      .then((u) => {
        if (password) {
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
