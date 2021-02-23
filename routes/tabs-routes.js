const express = require('express');
const { check } = require('express-validator');
const tabsController = require('../controllers/tabs-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

router.get('/', tabsController.getTabs);
router.get('/user/:uid', tabsController.getTabsByUserId);
router.get('/type/:tid', tabsController.getTabsByTypeId);
router.get('/allByInstrumentId/:iid', tabsController.getTabsbyInstrumentId);
router.get('/:tid', tabsController.getTabsById);
router.patch(
  '/:tid',
  fileUpload.single('file'),
  [check('name').not().isEmpty()],
  tabsController.updateTabs
);
router.use(checkAuth);
router.post(
  '/',
  fileUpload.single('file'),
  [check('name').not().isEmpty()],
  tabsController.createTabs
);
router.delete('/:tid', tabsController.deleteTab);

module.exports = router;
