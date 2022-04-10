/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/9/2022
 */

const uploader = require('../../helpers/SingleUploader');

function uploadAvatar(req, res, next){
    const upload = uploader(
        "avatars",
        ["image/jpg", "image/jpeg", "image/png"],
        1000000,
        "Only images jpg, jpeg, png images are allowed"
    );

    upload.any()(req, res, (error)=> {
        if( error ){
            res.status(500).json({
                errors:{
                    avatar: error.message
                }
            });
        } else {
            next();
        }
    } );
}

module.exports = uploadAvatar;