/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/18/2022
 */


function getCookie(req, res) {
    let coockieObjectLength = Object.keys(req.signedCookies).length;
    let result = {};


    if (coockieObjectLength > 0) {
        let cookieData = req.signedCookies[process.env.COOKIE_SECRET];

        result.token = cookieData.jwtToken;
        result.loggedInUsers = (cookieData) ? cookieData.userInfo : {};
    }

    return result;
}


module.exports = {
    getCookie
}