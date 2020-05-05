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

const sendConfirmationEmail = (user) => {

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
    const token = genToken(user);
    const url = `http://localhost:4000/api/auth/register/confirmation/${token}`
    nodemailerMailgun.sendMail({
        from: 'bookedup.pt9@gmail.com',
        to: `${user.email}`, 
        subject: 'Confirmation EMail',
    
        html: `<a href=${url}> ${url}`,
        text: "please click the link to confirm your registration"
      }).then(()=> {
          console.log('email sent')
      }).catch(err => {
          console.log(err)
      })
    
}

exports.sendConfirmationEmail = sendConfirmationEmail;
  
