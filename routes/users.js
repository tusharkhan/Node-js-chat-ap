var express = require('express');
var router = express.Router();

const { showUserPage, createUser, removeUser } = require('../controllers/UserController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const uploadAvatar = require("../middleware/user/avatarUpload");
const {userFieldValidation, userValidationHandler} = require("../middleware/user/UserFieldValidation");
const {loginAuth} = require("../middleware/user/UserAuth");

/* GET users listing. */
router.get('/', decorateHtmlResponse('Users Page'), loginAuth, showUserPage);

router.post('/', uploadAvatar, userFieldValidation, userValidationHandler, loginAuth, createUser);

router.delete('/:id', removeUser);

module.exports = router;
