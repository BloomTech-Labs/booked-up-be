const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');





module.exports = server => {
    server.use(helmet());
    server.use(express.json());
    server.use(cors());
    server.use(bodyParser.urlencoded({ extended: true }))
    server.use(cookieParser('keyboard cat'));
    server.use(session({ 
        cookie: { maxAge: 60000 },
        secret: 'secret123',
        resave: false,
        saveUninitialized: true
    }));
    server.use(flash());

};