const express = require('express');
const { check } = require('express-validator');
const rolesController = require('../controllers/roles-controller');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

router.get('/', rolesController.getRole);

router.get('/:pid', rolesController.getRoleById);

router.get('/user/:uid', rolesController.getRoleByUserId);

router.post('/', [check('name').not().isEmpty()], rolesController.createRole);
router.use(checkAuth);

router.patch(
  '/:sid',
  [check('name').not().isEmpty()],
  rolesController.updateRole
);

router.delete('/:pid', rolesController.deleteRole);

module.exports = router;
