const express = require('express');
const { check } = require('express-validator');
const difficultiesController = require('../controllers/difficulties-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', difficultiesController.getDifficulty);

router.get('/:tid', difficultiesController.getDifficultyById);
router.use(checkAuth);

router.post(
  '/',
  [check('name').not().isEmpty()],
  difficultiesController.createDifficulty
);

router.patch(
  '/:tid',
  [check('name').not().isEmpty()],
  difficultiesController.updateRole
);

router.delete('/:tid', difficultiesController.deleteRole);

module.exports = router;
