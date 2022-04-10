/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const { showInboxPage } = require('../controllers/InboxController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const express = require('express');
const router = express.Router();

router.get('/', decorateHtmlResponse('Inbox Page'),showInboxPage);

module.exports = router;