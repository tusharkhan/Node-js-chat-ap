/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/18/2022
 */
const {getCookie} = require("../../helpers/otherHelperFunctions");
const jwt = require('jsonwebtoken');

function loginAuth(req, res, next) {
    let cookieInfo = getCookie(req, res);

    if (cookieInfo.token) {

        try {
            req.user = cookieInfo.loggedInUsers;
        } catch (e) {
            console.log(e);
        }

        next();
    } else {
        res.redirect("/");
    }
}


function loginRedirectAuth(req, res, next) {
    let cookieInfo = getCookie(req, res);

    if (!cookieInfo.token) {
        next();
    } else {
        res.redirect("/inbox");
    }
}


module.exports = {
    loginAuth,
    loginRedirectAuth
}