const express = require('express');
const { check } = require('express-validator');
const tutorialsController = require('../controllers/tutorials-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', tutorialsController.getTutorials);
router.get('/:tuid', tutorialsController.getTutorialById);
router.use(checkAuth);
router.post(
  '/',
  [check('name').not().isEmpty()],
  tutorialsController.createTutorials
);

module.exports = router;
