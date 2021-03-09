const express = require('express');
const instrumentsController = require('./instrument.controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', instrumentsController.getInstruments);
router.get('/last-four', instrumentsController.getLastFourInstruments);
router.get('/instrument/:iid', instrumentsController.getInstrumentById);

router.use(checkAuth);

router.post(
    '/add',
    instrumentsController.createInstrument
);

router.patch(
    '/update/:iid',
    instrumentsController.updateInstrument
);

module.exports = router;
