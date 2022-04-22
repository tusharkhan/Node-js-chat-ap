var express = require('express');
var router = express.Router();
var {showLoginForm, login, logout} = require('../controllers/LoginController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const {loginValidation, loginValidateHandler} = require('../middleware/user/loginFieldValidation');
const {loginAuth, loginRedirectAuth} = require("../middleware/user/UserAuth");

/* GET home page. */
router.get('/', decorateHtmlResponse('Login Page'), loginRedirectAuth, showLoginForm);

router.post('/login', loginValidation, loginValidateHandler, login);

router.get('/logout', logout);
router.get('/logout2', logout);

module.exports = router;
