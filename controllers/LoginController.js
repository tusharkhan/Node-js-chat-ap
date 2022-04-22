/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const People = require('../models/Peoples');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

function showLoginForm(req, res, next) {
    res.render('login')
}


async function login(req, res, next) {
    try {
        let user = await People.findOne({email: req.body.email});
        if (user) {
            let validatePassword = await bcrypt.compare(req.body.password, user.password);

            if (validatePassword) {
                let userInfo = {
                    name: user.name,
                    email: user.email,
                    id: user._id,
                    role: "user"
                }

                let jwtToken = await jwt.sign(userInfo, process.env.JWT_SECRET, {expiresIn: 7 * 24 * 60 * 60 * 1000});

                res.cookie(process.env.COOKIE_SECRET, {jwtToken, userInfo}, {
                    httpOnly: true,
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                    signed: true
                });


                res.status(200).json({
                    message: "Login Successful",
                    user: userInfo
                });
            } else {
                res.status(404).json({
                    error: {
                        common: {
                            msg: "Invalid credentials"
                        }
                    }
                });
            }
        } else {
            res
                .status(404)
                .json({
                    error: {
                        common: {
                            msg: "Invalid credentials"
                        }
                    }
                });
        }

    } catch (e) {
        res
            .status(404)
            .json({
                error: {
                    common: {
                        msg: e.stack
                    }
                }
            });
    }
}


function logout(req, res, next) {
    console.log('req.cookies');
    res.clearCookie(process.env.COOKIE_SECRET);

    res.redirect('/');
}


module.exports = {
    showLoginForm,
    login,
    logout
}