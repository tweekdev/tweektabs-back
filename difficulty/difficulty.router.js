const express = require('express');
const difficultiesController = require('./difficulty.controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', difficultiesController.getDifficulties);

router.get('/difficulty/:did', difficultiesController.getDifficultyById);

router.use(checkAuth);

router.post(
    '/add',
    difficultiesController.createDifficulty
);

router.patch(
    '/update/:did',
    difficultiesController.updateDifficulty
);
module.exports = router;
