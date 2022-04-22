/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

function decorateHtmlResponse(pageTitle){
    return function(req, res, next){
        res.locals.html = true;
        res.locals.title = pageTitle;
        let coockieObjectLength = Object.keys(req.signedCookies).length;

        res.locals.loggedInUsers = {};
        res.locals.token = {};

        if (coockieObjectLength > 0) {
            res.locals.token = req.signedCookies[process.env.COOKIE_SECRET];
            res.locals.loggedInUsers = (res.locals.token) ? res.locals.token.userInfo : {};
        }

        next();
    }
}

module.exports = decorateHtmlResponse;