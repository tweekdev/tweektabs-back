const express = require('express');
const { check } = require('express-validator');
const typesController = require('../controllers/types-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', typesController.getType);

router.get('/:tid', typesController.getTypeById);

router.use(checkAuth);
router.post('/', [check('name').not().isEmpty()], typesController.createType);

router.patch(
  '/:tid',
  [check('name').not().isEmpty()],
  typesController.updateType
);

module.exports = router;
