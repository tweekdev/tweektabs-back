const express = require('express');
const { check } = require('express-validator');
const usersController = require('../controllers/users-controller');
const router = express.Router();

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
router.get('/:tid', usersController.getUsersByTabs);

router.post(
  '/signup',
  [
    check('firstname').not().isEmpty(),
    check('name').not().isEmpty(),
    check('pseudo').not().isEmpty(),
    check('email').not().isEmpty(),
    check('password').trim().isLength({ min: 6 }),
    check('role').not().isEmpty(),
    check('tabs'),
  ],
  usersController.signup
);
router.use(checkAuth);
router.patch(
  '/:uid',
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
