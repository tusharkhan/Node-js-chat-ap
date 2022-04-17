var express = require('express');
var router = express.Router();
var {showLoginForm, login} = require('../controllers/LoginController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const {loginValidation, loginValidateHandler} = require('../middleware/user/loginFieldValidation');

/* GET home page. */
router.get('/', decorateHtmlResponse('Login Page'), showLoginForm);

router.post('/login', loginValidation, loginValidateHandler, login);

module.exports = router;
