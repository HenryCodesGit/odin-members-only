const express = require('express');
const router = express.Router();

const logoutController = require('../controllers/logoutController');

/* Logout */
router.get('/', logoutController.read_get);

module.exports = router;
