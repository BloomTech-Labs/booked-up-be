const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const Users = require('../users/user-model.js');
const bcrypt = require('bcryptjs');


const { check, validationResult, body } = require('express-validator');
const { sendPasswordResetEmail } = require('../services/user-email-reset');

router.post('/', [
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Users.findByEmail(value).then(user => {
            let newUser = user.map(u => u.email_verification)
            if(user.length === 0) {
                return Promise.reject('email not registered');
            } else if (newUser[0] === false){
                return Promise.reject('email has not been validated');
            }
        });
    }),
],
(req, res) => {
    const errors = validationResult(req);
    let { email, id } = req.body;
    const updateUser = {
        password_reset: true,
    }
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        Users.findBy({ email })
        .first()
        .then(u => {
            Users.update(u.id, updateUser)
                .then(user => {
                    if(u) {
                        sendPasswordResetEmail(u)
                        res.status(200).json({message: 'email sent'})
                    }
                })
                .catch(err => {
                    res.status(500).json(err.message)
                })
        })  
    }
})

router.get('/reset/:id/:token', async (req,res) => {
    const decodedJwt = jwtDecode(req.params.token)

    jwt.verify(req.params.token,secrets.jwtSecret, (err, verifiedJWT) => {
        if(err){
            res.status(400).json(err)
        } else{
            res.render('user-password-reset', {error: req.flash('error'),  data: { id: decodedJwt.userid, token: req.params.token, type: decodedJwt.type}})
        }
    });
});


router.post('/reset/', [
    check("password",'Please enter a password').custom((value,{req, loc, path}) => {
            if(value !== req.body.confirmPassword) {
                throw new Error("Passwords do not match");
            } else {
                return value;
            }
        }),
        check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
        body("password").custom((value,{req, loc, path}) => {
            return Users.findById(Number(req.body.id)).then(user => {
                if(user ===  undefined){
                    throw new Error("User Id is not valid"); 
                } else if (bcrypt.compareSync(req.body.password, user.password)){
                    throw new Error("New password can not be previous password");
                }
            })
        })
    ],
(req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 12);
    const updateUser = {
        password_reset: false,
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
                Users.update(req.body.id, updateUser)
                    .then(u => {
                        console.log(u)
                        res.render('user-password-success')
                    })
                    .catch(err => {
                        res.status(400).json(err.message)
                    })
            }
        })  
    }
})


module.exports = router;