const userRouter = require('./user/user.router');
const typeRouter = require('./type/type.router');

module.exports = (app) => {
  //route users
  app.use('/api/tweektabs/users', userRouter);
  //route types
  app.use('/api/tweektabs/types', typeRouter);
};
