const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const Users = require('../users/user-model.js');
const { check, validationResult, body } = require('express-validator');

router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Users.findByAdmin(value).then(user => {
            console.log(user.length)
            if(user.length === 0) {
                return Promise.reject('email not registered');
            }
        });
    }),
],
(req, res) => {
    const errors = validationResult(req);
    let { email, id } = req.body;

    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        Users.findBy({ email })
        .first()
        .then(u => {
            if(u) {
                const token = genToken(u);
                // res.redirect(`http://localhost:4000/api/auth/admin/${id}`)
                res.status(200).json(token)
                // This is where I will send email confirmation in place of the token. When the link is clicked for confirmation a token will be given and sent to change account information
            }
            // else {
            //     res.status(401).json({message: "Invalid email"})
            // }
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