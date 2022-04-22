/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const { showInboxPage } = require('../controllers/InboxController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const express = require('express');
const {loginAuth} = require("../middleware/user/UserAuth");
const router = express.Router();

router.get('/', decorateHtmlResponse('Inbox Page'), loginAuth, showInboxPage);

module.exports = router;