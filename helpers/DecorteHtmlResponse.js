/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

function decorateHtmlResponse(pageTitle){
    return function(req, res, next){
        res.locals.html = true;
        res.locals.title = pageTitle;

        next();
    }
}

module.exports = decorateHtmlResponse;