var express = require('express');
var router = express.Router();
var {showLoginForm} = require('../controllers/LoginController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');


/* GET home page. */
router.get('/', decorateHtmlResponse('Login Page'),showLoginForm);

module.exports = router;
