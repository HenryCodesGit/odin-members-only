const express = require('express');
const router = express.Router();

const indexController = require('../controllers/indexController')

/* GET home page. */
router.get('/', indexController.index_get);

/* POSTing a message on the homepage */
router.post('/', indexController.create_post);

router.get('/delete/:id', indexController.delete_get)

module.exports = router;
