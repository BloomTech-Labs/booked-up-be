const express = require('express')
const configureMiddleware = require('./configure-middleware.js');
const registerRouter = require('../auth/register-router');
const loginRouter = require('../auth/login-router');
const usersRouter = require('../users/user-router');
const server = express();

configureMiddleware(server)

server.use('/api/auth/register', registerRouter);
server.use('/api/auth/login', loginRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
    res.status(200).json({api: "Booked Up server live."})
})
module.exports = server;

