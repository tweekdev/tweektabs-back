const express = require('express');
const { check } = require('express-validator');
const tutorialsController = require('../controllers/tutorials-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', tutorialsController.getTutorials);
router.get('/last', tutorialsController.getLastTutorials);
router.get(
  '/allByInstrumentId/:iid',
  tutorialsController.getTutosbyInstrumentId
);
router.get('/user/:uid', tutorialsController.getTutorialsByUserId);
router.get('/:tuid', tutorialsController.getTutorialById);
router.patch(
  '/:tid',
  [check('name').not().isEmpty()],
  tutorialsController.updateTutorial
);
router.use(checkAuth);
router.post(
  '/',
  [check('name').not().isEmpty()],
  tutorialsController.createTutorials
);

module.exports = router;
