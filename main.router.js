const userRouter = require('./user/user.router');

module.exports = (app) => {
  //route users
  app.use('/api/tweektabs/users', userRouter);
};
