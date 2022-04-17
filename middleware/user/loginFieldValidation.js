/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/12/2022
 */

const {check, validationResult} = require('express-validator');

const loginValidation = [
    check("email").trim().isEmail().withMessage("Enter a valid Email"),
    check("password")
        .isLength({min: 0})
        .withMessage('Password field is required')
];

const loginValidateHandler = function (req, res, next) {
    let validation = validationResult(req);
    let validationMap = validation.mapped();

    if (validation.isEmpty()) next();
    else {
        res.status(500).json({
            errors: validationMap
        });
    }
};

module.exports = {loginValidation, loginValidateHandler};