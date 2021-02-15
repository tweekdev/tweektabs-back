const express = require('express');
const { check } = require('express-validator');
const instrumentsController = require('../controllers/instruments-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', instrumentsController.getInstrument);
router.get('/last', instrumentsController.getLastInstrument);
router.get('/:tid', instrumentsController.getInstrumentById);
router.use(checkAuth);

router.post(
  '/',
  [check('name').not().isEmpty()],
  instrumentsController.createInstrument
);

router.patch(
  '/:tid',
  [check('name').not().isEmpty()],
  instrumentsController.updateRole
);

router.delete('/:tid', instrumentsController.deleteRole);

module.exports = router;
