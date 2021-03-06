const userController = require('./user.controller');
const fileUpload = require('../middleware/file-upload');

const express = require('express');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

//GET
router.get('/', userController.getUsers);
router.get('/last-seven', userController.getLastSevenUsers);
router.get('/user/:id', userController.getUserById);

//POST
router.post('/signup', fileUpload.single('picture'), userController.signup);
router.post('/login', userController.login);
router.post('/user/forgot-password', userController.forgotPassword);
router.patch('/user/reset-password', userController.resetPassword);

router.use(checkAuth);
//PATCH
router.patch(
  '/user/update/:uid',
  fileUpload.single('picture')
    ? fileUpload.single('picture')
    : fileUpload.none(),
  userController.updateUser
);
router.patch('/user/update-password/:uid', userController.updateUserPassword);

module.exports = router;
