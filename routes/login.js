const express = require('express');
const router = express.Router();
const passport = require('passport');

const loginController = require('../controllers/loginController');

/* Login page. */
router.get('/', loginController.read_get);
router.post('/', loginController.read_post);
module.exports = router;
