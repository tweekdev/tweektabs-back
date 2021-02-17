const express = require('express');
const { check } = require('express-validator');
const tutoTabsController = require('../controllers/tutos-tabs-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/:iid', tutoTabsController.getTutoTabsByInstrumentId);

module.exports = router;
