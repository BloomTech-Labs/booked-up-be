const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const Users = require('../users/user-model.js');
const { check, validationResult, body } = require('express-validator');
const { sendConfirmationEmail } = require('../services/email-service');

router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Users.findByAdmin(value).then(user => {
            let newUser = user.map(u => u.admin_verification)
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
                sendConfirmationEmail(u)
                res.status(200).json({message: 'email sent'})
            }
        })
        .catch(err => {
            res.status(500).json(err.message)
        })
      }
})

router.get('/confirmation/:token', async (req,res) => {
    const updateUser = {
        admin_verification: true
    }
    const decodedJwt = jwtDecode(req.params.token)

    jwt.verify(req.params.token,secrets.jwtSecret, (err, verifiedJWT) => {
        if(err){
            res.status(400).json(err)
        } else{
            Users.update(decodedJwt.userid, updateUser)
                .then(u => {
                    console.log(u.admin_verification)
                    res.status(200).json({
                        message: `Welcome back`,
                        token: req.params.token,
                        verifiedToken: verifiedJWT,
                        validated: u.admin_verification
                    })
                    // res.redirect(`http://to log in page`)
                })
                .catch(err => {
                    res.status(400).json(err)
                })
        }
    });
});


module.exports = router;