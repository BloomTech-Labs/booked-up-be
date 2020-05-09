const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');
const jwt = require('jsonwebtoken');
const secrets = require('../config/secrets.js');

const auth = {
    auth: {
      api_key: process.env.MAILGUN_API_KEY,
      domain: process.env.MAILGUN_DOMAIN
    },
}

const nodemailerMailgun = nodemailer.createTransport(mg(auth));

const sendPasswordResetEmail = (user) => {

    function genToken(user) {
        const payload = {
            userid: user.id,
            userName: user.first_name,
            userType: user.user_type
        }
    
        const options = {
            expiresIn: "1h"
        }
    
        const token = jwt.sign(payload, secrets.jwtSecret, options);
    
        return token;
    }
    const token = genToken(user);
    const url = `http://localhost:4000/api/users/password/reset/${user.id}/${token}`
    nodemailerMailgun.sendMail({
        from: process.env.EMAILADDRESS,
        to: `${user.email}`, 
        subject: 'BookedUp Password reset',
        html: `<div> Hi ${user.first_name}, please click the link to reset your password </div> <div><a href=${url}> ${url}</div>`
        
      }).then(()=> {
          console.log('email sent')
      }).catch(err => {
          console.log(err)
      })
    
}

exports.sendPasswordResetEmail = sendPasswordResetEmail;