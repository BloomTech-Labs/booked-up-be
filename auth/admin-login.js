const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Admins = require('../admins/admin-model');
const { check, validationResult, body } = require('express-validator');



router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Admins.findByEmail(value).then(user => {
            let newAdmin = user.map(u => u.email_verification)
          if (user.length === 0) {
            return Promise.reject('email not registered');
          } else if (newAdmin[0] === false){
            return Promise.reject('email has not been validated');
          }
        });
    }),
    check('password','password field is required').not().isEmpty(),
],
(req, res) => {
    const errors = validationResult(req);
    let { email, password } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        Users.findBy({ email })
        .first()
        .then(u => {
            if(u && bcrypt.compareSync(password, u.password)) {
                const token = genToken(u);

                res.status(200).json({
                    message: `Welcome back ${u.first_name}`,
                    token: token
                })
            }
            else {
                res.status(401).json({message: "Invalid credentials"})
            }
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
      }
})


function genToken(user) {
    const payload = {
        userid: user.id,
        userType: [`${user.user_type}`]
    }

    const options = {
        expiresIn: "8h"
    }

    const token = jwt.sign(payload, secrets.jwtSecret, options);

    return token;
}




module.exports = router;