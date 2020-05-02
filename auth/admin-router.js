const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const Users = require('../users/user-model.js');
const bcrypt = require('bcryptjs');
const { check, validationResult, body } = require('express-validator');
const { sendConfirmationEmailAdmin } = require('../services/admin-email-service');

router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Users.findByAdmin(value).then(user => {
            let newUser = user.map(u => u.email_verification)
            console.log(newUser[0])
            if(user.length === 0) {
                return Promise.reject('email not registered');
            } else if (newUser[0] === true){
                return Promise.reject('email already validated');
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
                sendConfirmationEmailAdmin(u)
                res.status(200).json({message: 'email sent'})
            }
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
      }
})

router.get('/reset/:id/:token', async (req,res) => {

    const decodedJwt = jwtDecode(req.params.token)
    jwt.verify(req.params.token,secrets.jwtSecret, (err, verifiedJWT) => {
        if(err){
            res.status(400).json(err)
        } else{
            console.log
            res.send(
                '<form action="/api/auth/admin/adminpasswordreset" method="POST">' +
                '<input type="hidden" name="id" value="' + decodedJwt.userid + '" />' +
                '<input type="hidden" name="token" value="' + req.params.token + '" />' +
                '<input type="password" name="password" value="" placeholder="Enter your new password..." />' +
                '<input type="submit" />' +
                '</form>');
        }
    });
});

router.post('/adminpasswordreset', [
        check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    ],
(req, res) => {
    console.log(req.body)
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updateUser = {
        email_verification: true,
        password: hash
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        Users.update(req.body.id, updateUser)
                .then(u => {
                    console.log(u)
                    res.status(200).json({
                        message: `password updated. Please log in. http://bookedup.net`
                    })
                })
                .catch(err => {
                    res.status(400).json(err.message)
                })
      }
})


module.exports = router;