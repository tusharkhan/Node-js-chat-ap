/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

let People = require('../models/Peoples');

function showInboxPage(req, res, next) {
    People.find({}, function (error, result) {
        if (error) {
            return next(error);
        }
        res.render('inbox', {
            title: 'Inbox',
            users: result
        });
    });
}


module.exports = {
    showInboxPage
};