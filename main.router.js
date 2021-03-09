const userRouter = require('./user/user.router');
const typeRouter = require('./type/type.router');
const difficultyRouter = require('./difficulty/difficulty.router');
const express = require('express');
const router = express.Router();
module.exports = (app) => {
  //route
  app.use('/', router.get('/',  (req, res) => {
    res.send('API is running...')
  }));
  //route
  //route
  app.use('/api', router.get('/',  (req, res) => {
    res.send('API is running...')
  }));
  //route
  app.use('/api/tweektabs', router.get('/',  (req, res) => {
    res.send('API is running...')
  }));
  //route users
  app.use('/api/tweektabs/users', userRouter);
  //route types
  app.use('/api/tweektabs/types', typeRouter);
  //route difficulties
  app.use('/api/tweektabs/difficulties', difficultyRouter);
  //route instruments
  app.use('/api/tweektabs/instruments', difficultyRouter);

  //route 404
  app.get('*', function(req, res){
    res
        .status(404)
        .send(
             'This route does not exist !!'
        );
  });
};
