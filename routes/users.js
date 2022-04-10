var express = require('express');
var router = express.Router();

const { showUserPage, createUser, removeUser } = require('../controllers/UserController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const uploadAvatar = require("../middleware/user/avatarUpload");
const {userFieldValidation, userValidationHandler} = require("../middleware/user/UserFieldValidation");

/* GET users listing. */
router.get('/', decorateHtmlResponse('Users Page'),showUserPage);

router.post('/', uploadAvatar, userFieldValidation, userValidationHandler, createUser);

router.delete('/:id', removeUser);

module.exports = router;
