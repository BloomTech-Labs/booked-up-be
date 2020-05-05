const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model.js');
const { check, validationResult, body } = require('express-validator');
const { sendConfirmationEmail } = require('../services/email-service');
const jwtDecode = require('jwt-decode');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');


router.post('/', [
        check('email','Must be a valid email of 5 to 30 chars').isEmail(),
        check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
        check('user_type','must be either author, fan or agent').isIn(['author', 'agent', 'fan']),
        check('first_name','must contain first name').not().isEmpty(),
        check('last_name','must contain last name').not().isEmpty(),
        check('city','city name').optional(),
        check('state','state name').optional(),
        check('country','country name').optional(),
        check('avatar_url','url for avatar image').optional(),
        body('display_name').optional().custom(value => {
            return Users.findByDisplayName(value).then(user => {
              if (user.length > 0) {
                return Promise.reject('display name already in use');
              }
            });
        }),
        body('email').custom(value => {
          return Users.findByEmail(value).then(user => {
              console.log(user)
            if (user.length > 0) {
              return Promise.reject('email already registered');
            }
          });
      }),
    ],
    (req, res) => {
        const errors = validationResult(req);
        let user = req.body;
        const hash = bcrypt.hashSync(user.password, 12);
        user.password = hash
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array());
          } else {
            Users.add(user)
                .then(u => {
                    sendConfirmationEmail(u)
                    res.status(201).json(u)
                })
                .catch(err => {
                    res.status(500).json(err.message)
                })
          }
})


router.get('/confirmation/:token', async (req,res) => {
  const updateUser = {
      email_verification: true
  }
  const decodedJwt = jwtDecode(req.params.token)

  jwt.verify(req.params.token,secrets.jwtSecret, (err, verifiedJWT) => {
      if(err){
          res.status(400).json(err)
      } else{
          Users.update(decodedJwt.userid, updateUser)
              .then(u => {
                  res.status(200).json({
                      message: `Registration succesfull ${u.email}`
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