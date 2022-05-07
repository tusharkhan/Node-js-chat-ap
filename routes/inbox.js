/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const {
    showInboxPage,
    createConversation,
    getUserConversationList,
    sendMessage, deleteUserMessages
} = require('../controllers/InboxController');
const decorateHtmlResponse = require('../helpers/DecorteHtmlResponse');
const express = require('express');
const {loginAuth} = require("../middleware/user/UserAuth");
const router = express.Router();

router.post('/create/conversation', loginAuth, createConversation);

router.get('/', decorateHtmlResponse('Inbox Page'), loginAuth, showInboxPage);

router.post('/getConversationList', loginAuth, getUserConversationList);

router.post('/sendMessage', loginAuth, sendMessage);

router.delete('/deleteUserMessages', loginAuth, deleteUserMessages);

module.exports = router;