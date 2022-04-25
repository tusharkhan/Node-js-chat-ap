/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

let People = require('../models/Peoples');
const {getCookie} = require("../helpers/otherHelperFunctions");

function showInboxPage(req, res, next) {
    People.find({}, function (error, result) {
        if (error) {
            return next(error);
        }

        res.render('inbox', {
            title: 'Inbox',
            users: result,
            loggedInUser: req.user
        });
    });
}


function createConversation(req, res, next) {
    res.status(200).json({
        message: req.body
    });
}


module.exports = {
    showInboxPage,
    createConversation
};