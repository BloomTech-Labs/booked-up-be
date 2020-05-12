const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const Users = require('../users/user-model.js');
const { check, validationResult, body } = require('express-validator');



// router.post('/', [
    
//     check('email','email field is required').not().isEmpty(),
//     check('email','a valid email is required').isEmail(),
//     body('email').custom(value => {
//         return Users.findByEmail(value).then(user => {
//             let newUser = user.map(u => u.email_verification)
//           if (user.length === 0) {
//             return Promise.reject('email not registered');
//           } else if (newUser[0] === false){
//             return Promise.reject('email has not been validated');
//           }
//         });
//     }),
//     check('password','password field is required').not().isEmpty(),
// ],
// (req, res) => {
//     const errors = validationResult(req);
//     let { email, password } = req.body;

//     if (!errors.isEmpty()) {
//         return res.status(422).jsonp(errors.array());
//       } else {
//         Users.findBy({ email })
//         .first()
//         .then(u => {
//             if(u && bcrypt.compareSync(password, u.password)) {
//                 const token = genToken(u);

//                 res.status(200).json({
//                     message: `Welcome back`,
//                     token: token
//                 })
//             }
//             else {
//                 res.status(401).json({message: "Invalid credentials"})
//             }
//         })
//         .catch(err => {
//             res.status(500).json(err.message)
//         })
//       }
// })



router.post('/', [
    
    check('email','email field is required').not().isEmpty(),
    check('email','a valid email is required').isEmail(),
    body('email').custom(value => {
        return Users.findByEmail(value).then(user => {
            let newUser = user.map(u => u.email_verification)
          if (user.length === 0) {
            return Promise.reject('email not registered');
          } else if (newUser[0] === false){
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
                        
                        const userList = {
                            id: u.id,
                            userType: u.user_type,
                            firstName: u.first_name,
                            lastName: u.last_name,
                            displayName: u.display_name,
                            email: u.email,
                            country: u.country,
                            state: u.state,
                            city: u.city,
                            image: u.image,
                            createdAt: u.created_at
                        }

                        Users.findByIdContentLibrary(u.id)
                            .then(content => {
                                const contentLibraryList = content.map(info => {
                                    const {title, content_url, created_at, last_updated} = info
                                    return {title, content_url, created_at, last_updated}
                                })
                            Users.findAgentInfoId(u.id)
                                .then(agentInfo => {
                                    const AgentInfoList = agentInfo.map(info => {
                                        const {agent_type, agency_type, agency_address, agency_phone_number, agency_email} = info
                                        return {agent_type, agency_type, agency_address, agency_phone_number, agency_email}
                                    })
                            Users.findByIdAuthorContent(u.id)
                                .then(authorContent => {
                                    const authorContentList = authorContent.map(info => {
                                        const {title, content_url, created_at, last_updated} = info
                                        return {title, content_url, created_at, last_updated}
                                    })
                                    if(u.user_type === 'author') {
                                        res.status(200).json({
                                            User: userList,
                                            AuthorContent: authorContentList,
                                            ContentLibrary: contentLibraryList,
                                            Token: token
                                        })
                                    } else if(u.user_type === 'agent'){
                                        res.status(200).json({
                                            User: userList,
                                            AgentInfo: AgentInfoList,
                                            contentLibrary: contentLibraryList,
                                            Token: token
                                        })
                                    } else {
                                        res.status(200).json({
                                            User: userList,
                                            contentLibrary: contentLibraryList,
                                            Token: token
                                        })
                                    }
                                })
                                .catch(err => {
                                    res.status(500).json(err)
                                })
                              })
                            })

                    } else {
                        res.status().json({message: "Invalid Credentials"})
                    }
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