const router = require('express').Router();

const Admins = require('./admin-model');
const bcrypt = require('bcryptjs');
const checkRole = require('../check-role/check-role-admin.js');
const restricted = require('../auth/restricted');
const { check, validationResult, body } = require('express-validator');

// UPDATE password

router.patch('/:id/updatePass', [
    check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    check('id').exists().toInt().optional().custom(value => {
        return Admins.findById(value).then(user => {
          if (user === undefined) {
            return Promise.reject('Admin Id not found');
          }
        });
    }),
], restricted, checkRole(), 
(req, res) => {
    const errors = validationResult(req);
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updatePass = {
        password: hash
    }
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Admins.update(req.params.id, updatePass)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    } 
});

module.exports = router;