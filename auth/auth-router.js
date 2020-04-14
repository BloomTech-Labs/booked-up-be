const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');
const Users = require('../users/user-model.js');

router.post('/register', (req, res) => {
    let user = req.body;
    const hash = bcrypt.hashSync(user.password, 12);
    user.password = hash
    Users.add(user)
        .then(u => {
            res.status(201).json(u)
        })
        .catch(err => {
            res.status(500).json(err)
        })
})

router.post('/login', (req, res) => {
    let { username, password } = req.body;
    
    Users.findBy({ username })
        .first()
        .then(u => {
            if(u && bcrypt.compareSync(password, u.password)) {
                const token = genToken(u);

                res.status(200).json({
                    message: `Welcome back ${u.username}`,
                    token: token
                })
            }
            else {
                res.status(500).json({message: "Error login in. Please try again."})
            }
        })
})

function genToken(user) {
    const payload = {
        userid: user.id,
        user: user.username,
    }

    const options = {
        expiresIn: "8h"
    }

    const token = jwt.sign(payload, secrets.jwtSecret, options);

    return token;
}

module.exports = router;