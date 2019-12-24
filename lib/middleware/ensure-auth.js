const User = require('../models/User');

module.exports = (req, res, next) => {
  // 1. we want to get session cookie
  const token = req.cookies.session;
  // 2. we want to use findByToken to get user
  User
    .findByToken(token, res)
    .then(user => {
      // 3. req.user = found user
      req.user = user;
      // 4. next()
      next();
    })
    .catch(next);
};
