const express = require('express');
const { check } = require('express-validator');
const instrumentsController = require('../controllers/instruments-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', instrumentsController.getInstrument);
router.get('/last', instrumentsController.getLastInstrument);
router.get('/alltutos/:iid', instrumentsController.getTutosbyInstrumentId);
router.get('/:iid', instrumentsController.getInstrumentById);
router.use(checkAuth);

router.post(
  '/',
  [check('name').not().isEmpty()],
  instrumentsController.createInstrument
);

router.patch(
  '/:iid',
  [check('name').not().isEmpty()],
  instrumentsController.updateInstrument
);

module.exports = router;
