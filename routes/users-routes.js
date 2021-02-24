const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');
const checkAuth = require('../middleware/check-auth');

router.post(
  '/login',
  [
    check('email').not().isEmpty(),
    check('password').trim().isLength({ min: 6 }),
  ],
  usersController.login
);

router.get('/', usersController.getUsers);

router.get('/user/:uid', usersController.getUsersById);
router.post('/forgotPassword', usersController.forgotPassword);
router.get('/:tid', usersController.getUsersByTabs);
router.post('/signup', fileUpload.single('picture'), usersController.signup);
router.patch('/user/resetPassword', usersController.resetPassword);
router.use(checkAuth);
router.patch('/user/password/:uid', usersController.updateUserPassword);
router.patch(
  '/:uid',
  fileUpload.single('picture')
    ? fileUpload.single('picture')
    : fileUpload.none(),
  [
    check('firstname').not().isEmpty(),
    check('name').not().isEmpty(),
    check('pseudo').not().isEmpty(),
    check('email').not().isEmpty(),
    check('role').not().isEmpty(),
  ],
  usersController.updateUser
);

module.exports = router;
