/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/9/2022
 */

const {check, validationResult} = require('express-validator');
const creteError = require('http-errors');
const People = require('../../models/Peoples');
const path = require('path');
const {unlink} = require('fs');


let userFieldValidation = [
        check("email").isEmail().withMessage("Enter a valid Email"),
        check("name").
        isLength({min: 1}).
        withMessage("Name is required").
        trim().
            custom( async ( value ) => {
                try{
                    let checkUserExist = await People.findOne({ email: value });

                    if( checkUserExist ){
                        throw  creteError("Email-exist");
                    }

                } catch (e) {
                    throw creteError(e.message);
                }
        }),
        check("mobile")
            .isMobilePhone("bn-BD", {
                strictMode: true
            })
            .withMessage("Phone should be a valid Bangladeshi number including +880 ")
            .custom( async (phone) => {
                try{
                    let checkPhone = await People.findOne({mobile:phone});

                    if( checkPhone ) throw creteError("Phone is already used")

                } catch (e) {
                    throw creteError(e.message);
                }
        } ),
        check("password")
            .isLength({min:6})
            .withMessage("Password should be more or equal to 6 characters")
    ];



const userValidationHandler = function (req, res, next){
    let validation = validationResult(req);
    let mappedErrors = validation.mapped();

    if ( Object.keys(mappedErrors).length === 0 ) next();
    else {
        if( req.files.length > 0 ){
            let {filename} = req.files[0];
            let filePath = path.join(__dirname, '../../public/uploads/avatars/' + filename);
            console.log(filePath);

            unlink(filePath, (error) => {
                if( error ) console.log(error);
            });
        }
        res.status(500).json({
            errors: mappedErrors
        });
    }
};

module.exports = {
    userFieldValidation,
    userValidationHandler
};