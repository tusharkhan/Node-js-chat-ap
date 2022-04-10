/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const createError = require("http-errors");

// not found error
function notFound(req, res, next){

    next(createError(404, 'Requested url not found'));
}



// error handler
function errorHandler(err, req, res, next){

    res.locals.error = process.env.NODE_ENV === 'development' ? err : {message: err.message};

    res.status(err.status || 500);

    if( res.locals.html ){
        res.render('error', {
            title: 'Error',
        });
    } else {
        res.json(res.locals.error);
    }
}


module.exports = {
    notFound,
    errorHandler
};