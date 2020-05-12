const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const Admins = require('../admins/admin-model.js');
const bcrypt = require('bcryptjs');


const { check, validationResult, body } = require('express-validator');
const { sendConfirmationEmailAdmin } = require('../services/admin-email-registration');

router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Admins.findByAdmin(value).then(user => {
            let emailConf = user.map(u => u.email_verification)
            if(user.length === 0) {
                return Promise.reject('email not registered');
            } else if (emailConf[0] === true){
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
        Admins.findBy({ email })
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
            res.render('admin-password-confirmation', {error: req.flash('error'),  data: { id: decodedJwt.userid, token: req.params.token, type: decodedJwt.userType}})
        }
    });
});


router.post('/adminpasswordreset/', [
    check("password",'Please enter a password').custom((value,{req, loc, path}) => {
            if(value !== req.body.confirmPassword) {
                throw new Error("Passwords do not match")
            } else {
                return value;
            }
        }),
        check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    ],
(req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updateUser = {
        email_verification: true,
        password: hash
    }
    const errors = validationResult(req);

    const errArr = errors.array();
    const errMsg = errArr.map((err) => {
        return "  " + err.msg;
    })
    if (!errors.isEmpty()) {
        req.flash("error", errMsg);
        return res.redirect('back')
      } else {
        jwt.verify(req.body.token,secrets.jwtSecret, (err, verifiedJWT) => {
            if(err){
                res.status(400).json(err)
            } else {
                Admins.update(req.body.id, updateUser)
                .then(u => {
                    res.render('success')
                })
                .catch(err => {
                    res.status(400).json(err.message)
                })
            }
        })  
    }
})


module.exports = router;
