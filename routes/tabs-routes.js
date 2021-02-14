const express = require('express');
const { check } = require('express-validator');
const tabsController = require('../controllers/tabs-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const fileUpload = require('../middleware/file-upload');

router.get('/', tabsController.getTabs);
router.get('/:tid', tabsController.getTabsById);
router.use(checkAuth);
router.post(
  '/',
  fileUpload.single('file'),
  [check('name').not().isEmpty()],
  tabsController.createTabs
);

module.exports = router;
