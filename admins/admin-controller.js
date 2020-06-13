const bcrypt = require("bcryptjs");
const Admins = require("./admin-model");

// UPDATE password

exports.updatePassword = [
  (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updatePass = {
      password: hash,
    };
    Admins.update(req.params.id, updatePass)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];

// Update Email

exports.updateEmail = [
  (req, res) => {
    const updateUser = {
      email: req.body.email,
    };
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).jsonp(errors.array());
    }
    Users.update(req.params.id, updateUser)
      .then((user) => {
        res.status(200).json(user);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
];
