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
router.use(checkAuth);
router.patch(
  '/:tid',
  [check('name').not().isEmpty()],
  tutorialsController.updateTutorial
);
router.post(
  '/',
  [check('name').not().isEmpty()],
  tutorialsController.createTutorials
);
router.delete('/deletetutoadmin/:tid', tutorialsController.deleteTutoAdmin);
router.delete('/:tid', tutorialsController.deleteTuto);

module.exports = router;
