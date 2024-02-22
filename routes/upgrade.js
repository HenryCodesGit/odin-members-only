var express = require('express');
var router = express.Router();

const upgradeController = require('../controllers/upgradeController')

/* GET users listing. */
router.get('/', upgradeController.upgrade_get);
router.post('/', upgradeController.upgrade_post);

module.exports = router;
