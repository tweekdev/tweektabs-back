const userController = require('./user.controller');

module.exports = (app) => {
    app.get('/', userController.getUsers);
    // Soit logique dans tes noms, tu renvoi les 7 dernier users
    app.get('/last-seven', userController.getLastSevenUsers);
}
