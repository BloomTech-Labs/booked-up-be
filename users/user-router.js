const router = require('express').Router();
const Agents = require('../agents/agent-model.js')
const Users = require('./user-model.js');
const bcrypt = require('bcryptjs');
const checkRole = require('../check-role/check-role-user.js');
const checkRoleAdmin = require('../check-role/check-role-admin.js');
const checkRoleAgent = require('../check-role/check-role-agent.js');
const restricted = require('../auth/restricted');
const { check, validationResult, body } = require('express-validator');

// GET all users

router.get('/', restricted, checkRoleAdmin(),(req, res) => {
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

// UPDATE user 

router.patch('/:id/', [
    check('first_name','must contain first name').not().isEmpty(),
    check('last_name','must contain last name').not().isEmpty(),
    check('city','city name').optional(),
    check('state','state name').optional(),
    check('country','country name').optional(),
    check('avatar_url','url for avatar image').optional(),
], restricted, checkRole(), 
(req, res) => {
    const updateUser = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        user_type: req.body.user_type,
        city: req.body.city,
        state: req.body.state,
        country: req.body.country,
        avatar_url: req.body.avatar_url,
      }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Users.update(req.params.id, updateUser)
            .then(user => {
                res.status(200).json(user)
            
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }        
});

// UPDATE email

router.patch('/:id/email', [
    check('email','Must be a valid email').isEmail(),
    body("email").custom((value,{req, loc, path}) => {
        return Users.findByEmail(value).then(user => {
            if(user.length === 0){
                return null; 
            } else if(user[0].email === value && Object.is(Number(req.params.id), user[0].id)) {
                return Promise.reject('Please choose a new email')
            } else if(user.length > 0) {
                return Promise.reject('email already registered'); 
            }
        })
    })
], restricted, checkRole(), 
(req, res) => {
    const updateUser = {
        email: req.body.email
      }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Users.update(req.params.id, updateUser)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }        
});

//UPDATE display name

router.patch('/:id/displayName', [
    check("display_name", "display name").optional(),
    body("display_name").custom((value,{req, loc, path}) => {
        return Users.findByDisplayName(value).then(user => {
            if(user.length === 0) {
                return null
            } else if(user[0].display_name === value && Object.is(Number(req.params.id), user[0].id)) {
                return Promise.reject('Please choose a new display name')
            } else if(user.length > 0) {
                return Promise.reject('display name already registered'); 
            }
        })
    })
], restricted, checkRole(), 
(req, res) => {
    const updateUser = {
        display_name: req.body.display_name
      }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Users.update(req.params.id, updateUser)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }        
});

// UPDATE password

router.patch('/:id/updatePass', [
    check('password','Must contain 8 characters - one uppercase, one lowercase, one number, one special').matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
    check('id').exists().toInt().optional().custom(value => {
        return Users.findById(value).then(user => {
          if (user === undefined) {
            return Promise.reject('User Id not found');
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
        Users.update(req.params.id, updatePass)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    } 
});

// DELETE user

router.delete('/:id/', [
    check('id').exists().toInt().optional().custom(value => {
        return Users.findById(value).then(user => {
          if (user === undefined) {
            return Promise.reject('User Id not found');
          }
        });
    }),
], restricted, checkRole(), (req, res) => {
    Users.removeUser(req.params.id)
      .then(post => {
        res.status(200).json(post);
      })
      .catch(err => {
        res.status(500).json(err);
      })
});

// GET Agent Info by Id

router.get('/:id/agent', [
    check('id').exists().toInt().optional().custom(value => {
        return Agents.findByAgentInfoId(value).then(user => {
          if (user === undefined) {
            return Promise.reject('Agent Info not found');
          }
        });
    }),
  ], restricted, checkRoleAgent(), 
   (req,res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Agents.findById(req.params.id)
            .then(user => {
                res.status(200).json(user)
            })
            .catch(err => {
                res.status(500).json(err)
            })  
    }
})

// POST Agent Info

router.post('/:id/agent', [
    check('agent_type', 'type of agent').optional(),
    check('agency_name', 'name of agency worked at').optional(),
    check('agency_address', 'agency address').optional(),
    check('agency_phone_number', 'agency phone number').optional(),
    check('agency_email', 'agency email').optional(),
    check('id').exists().toInt().optional().custom(value => {
        return Users.findById(value).then(user => {
          if (user === undefined) {
            return Promise.reject('User Id not found');
          }
        });
    }),
    check('id').exists().toInt().optional().custom(value => {
        return Agents.findByAgentInfoId(value).then(user => {
            console.log(user)
          if (user) {
            return Promise.reject('Agent info already created');
          }
        });
    }),
], restricted, checkRoleAgent(), 
(req, res) => {
    const agentInfo = {
        user_id: req.params.id,
        agent_type: req.body.agent_type,
        agency_name: req.body.agency_name,
        agency_address: req.body.agency_address,
        agency_phone_number: req.body.agency_phone_number,
        agency_email: req.body.agency_email
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Agents.add(agentInfo)
            .then(agent => {
                res.status(200).json(agent)
            })
            .catch(err => {
                res.status(500).json(err.message)
            })
    }  
});

// UPDATE Agent Info 

router.patch('/:id/agent', [
    check('agent_type', 'type of agent').optional(),
    check('agency_name', 'name of agency worked at').optional(),
    check('agency_address', 'agency address').optional(),
    check('agency_phone_number', 'agency phone number').optional(),
    check('agency_email', 'agency email').optional(),
    check('id').exists().toInt().optional().custom(value => {
        return Agents.findByAgentInfoId(value).then(user => {
          if (user === undefined) {
            return Promise.reject('User Id not found');
          }
        });
    }),
], restricted, checkRoleAgent(), 
(req, res) => {
    const updateAgentInfo = {
        agent_type: req.body.agent_type,
        agency_name: req.body.agency_name,
        agency_address: req.body.agency_address,
        agency_phone_number: req.body.agency_phone_number,
        agency_email: req.body.agency_email,
        user_id: req.params.id,
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).jsonp(errors.array());
    } else {
        Agents.update(req.params.id, updateAgentInfo)
            .then(agent => {
                res.status(200).json(agent)
            })
            .catch(err => {
                res.status(500).json(err)
            })
    }  
});






module.exports = router;