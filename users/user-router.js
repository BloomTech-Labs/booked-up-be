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
            .then(user => {
                if(user.user_type !== 'agent') {
                    res.status(200).json({user})
                } else {
                    Users.findAgentInfoId(req.params.id)
                    .then(agentInfo => {
                        const infoList = agentInfo.map(info => {
                            const {agent_type, agency_type, agency_address, agency_phone_number, agency_email} = info
                            return {agent_type, agency_type, agency_address, agency_phone_number, agency_email}
                        })
                        res.status(200).json({
                            User: user,
                            AgentInfo: infoList
                        })
                    })
                    .catch(err => {
                        res.status(500).json(err)
                    }) 
                }   
        })
    }
})





module.exports = router;