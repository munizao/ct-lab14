const { Router } = require('express');
const User = require('../models/User');
// var jwt = require('jsonwebtoken');
const ensureAuth = require('../middleware/ensure-auth');
const MAX_AGE_IN_MS = 24 * 60 * 60 * 1000;

const setSessionCookie = function(res, token) {
  res.cookie('session', token, {
    maxAge: MAX_AGE_IN_MS
  });  
};

module.exports = Router()
  .post('/signup', (req, res, next) => {
    User
      .create(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })

  .post('/login', (req, res, next) => {
    User
      .authenticate(req.body)
      .then(user => {
        setSessionCookie(res, user.authToken());
        res.send(user);
      })
      .catch(next);
  })
  //adapted from example at https://dev.to/perrydbucs/using-jwts-for-authentication-in-restful-applications-55hc
  .get('/signed-in', ensureAuth, (req, res) => {
    res.send(req.user);
    // const userJWT = req.cookies.session;
    // if(!userJWT) {
    //   res.send(401, 'Invalid or missing authorization token');
    // }
    // else {
    //   const userJWTPayload = jwt.verify(userJWT, process.env.APP_SECRET);
    //   if(!userJWTPayload) {
    //     res.clearCookie('session');
    //     res.send(401, 'Invalid or missing authorization token');
    //   }
    //   User.findOne({ email: userJWTPayload.email })
    //     .then(user => {
    //       if(!user) {
    //         res.send(401, 'User not currently logged in');
    //       }
    //       else {
    //         res.send(user);
    //       }
    //     })
    //     .catch(next);
    // }
  });
