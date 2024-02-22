const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');

/* GET register page. */
router.get('/', registerController.create_get);
router.post('/', registerController.create_post);

module.exports = router;
