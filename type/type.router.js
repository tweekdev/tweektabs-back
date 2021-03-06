const express = require('express');
const typesController = require('./type.controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', typesController.getTypes);

router.get('/type/:tid', typesController.getTypeById);

router.use(checkAuth);
router.post('/add',  typesController.createType);

router.patch(
    '/update/:tid',
    typesController.updateType
);

module.exports = router;
