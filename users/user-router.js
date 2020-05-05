const router = require('express').Router();

const Users = require('./user-model.js');

const checkRole = require('../check-role/check-role-user.js');
const restricted = require('../auth/restricted');
const { check, validationResult, body } = require('express-validator');

// GET all users

router.get('/', restricted, checkRole(),(req, res) => {
    Users.find()
        .then(users => {
            res.status(200).json(users)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

// GET user by id

router.get('/:id', [
    check('id').exists().toInt().optional().custom(value => {
        return Users.findById(value).then(user => {
            console.log(user)
          if (user === undefined) {
            return Promise.reject('User Id not found');
          }
        });
    }),
  ], restricted, checkRole(), 
   (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
      } else {
        Users.findById(req.params.id)
            .then(u => {
                res.status(200).json(u)
            })
            .catch(err => {
                res.status(500).json(err)
            })
      }
  })




module.exports = router;