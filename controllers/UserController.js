/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const People = require('../models/Peoples');
const bcrypt = require('bcrypt');
const { unlink } = require('fs');
const path = require('path');

async function showUserPage(req, res, next) {
    try {
        let users = await People.find();

        res.render('users', {
            users: users
        });
    } catch (e) {
        next(e);
    }
}

async function createUser(req, res, next){
    let hashedPass = await bcrypt.hash(req.body.password, 10);
    let newUser = null;

    let {filename} = req.files[0] || {};


    if( req.files && req.files.length > 0 ){
        newUser = People({
            ...req.body,
            avatar: filename,
            password: hashedPass
        });
    } else {
        newUser = People({
            ...req.body,
            password: hashedPass
        });
    }

    try{
        let result = await newUser.save();

        res.status(201).json({
            message: "User created",
            user: result
        });

    } catch (e) {
        res.status(401).json({
            errors:{
                avatar:{
                    msg:"Internal server error " + e.stack
                }
            }
        });
    }
}


async function removeUser(req, res, next){
    try{
        let user = await People.findByIdAndDelete({
            _id: req.params.id
        });

        if ( user.avatar ){
            let pathLink = path.join(
                __dirname, '/../public/uploads/avatars/' + user.avatar
            );

            unlink(pathLink, ( error ) =>{
                if( error ) console.log(error)
            });
        }

        res.status(200).json({
            message:"User deleted successfully"
        });
    } catch (err) {
        res.status(500).json({
            errors:{
                common: {
                    msg: "Internal server error "
                }
            }
        });
    }
}

module.exports = {
    showUserPage,
    createUser,
    removeUser
};