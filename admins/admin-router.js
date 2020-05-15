const router = require('express').Router();

const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const Admins = require('./admin-model');
const checkRole = require('../check-role/check-role-admin.js');
const restricted = require('../auth/restricted');

// UPDATE password

router.patch('/:id/updatePass', [
  check('password', 'Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, 'i'),
  check('id').exists().toInt().optional()
    .custom((value) => Admins.findById(value).then((user) => {
      if (user === undefined) {
        return Promise.reject('Admin Id not found');
      }
    })),
], restricted, checkRole(),
(req, res) => {
  const errors = validationResult(req);
  const hash = bcrypt.hashSync(req.body.password, 12);
  const updatePass = {
    password: hash,
  };
  if (!errors.isEmpty()) {
    return res.status(422).jsonp(errors.array());
  }
  Admins.update(req.params.id, updatePass)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

// Update email

router.patch('/:id/email', [
  check('email', 'Must be a valid email').isEmail(),
  body('email').custom((value, { req, loc, path }) => Admins.findByEmail(value).then((user) => {
    if (user.length === 0) {
      return null;
    } if (user[0].email === value && Object.is(Number(req.params.id), user[0].id)) {
      return Promise.reject('Please choose a new email');
    } if (user.length > 0) {
      return Promise.reject('email already registered');
    }
  })),
], restricted, checkRole(),
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
});

module.exports = router;
