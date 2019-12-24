const { Router } = require('express');
const Dance = require('../models/Dance');
const ensureAuth = require('../middleware/ensure-auth');
// const request = 

module.exports = Router()
  //should only work if logged in
  .post('/', ensureAuth, (req, res, next) => {
    return Dance
      .create(req.body)
      .then(dance => res.send(dance))
      .catch(next);
  })
  //should work for anyone
  .get('/', (req, res, next) => {
    return Dance
      .find()
      .then(dances => res.send(dances))
      .catch(next);
  })
  .patch('/:id', ensureAuth, (req, res, next) => {
    const { name } = req.body;
    return Dance
      .findByIdAndUpdate(req.params.id, { name }, { new: true })
      .then(dance => res.send(dance))
      .catch(next);
  })
  .delete('/:id', ensureAuth, (req, res, next) => {
    return Dance
      .findByIdAndDelete(req.params.id)
      .then(dance => res.send(dance))
      .catch(next);
  });
