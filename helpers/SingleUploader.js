/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/9/2022
 */

const multer = require('multer');
const path = require('path');
const createError = require('http-errors')

const upload_path = __dirname + '/../public/uploads/';

function uploader(path_name, file_types, max_size, validation_message){
    let path_to_upload = path.join(upload_path, path_name);

    const diskStorage = multer.diskStorage({
        destination: function(req, file, cb){
            cb(null, path_to_upload);
        },
        filename: function(req, file, cb){
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

            let ext = file.mimetype.split('/').reverse()[0];

            cb(null, file.fieldname + '-' + uniqueSuffix+'.'+ext)
        }
    });

    return multer({
        storage: diskStorage,
        limits:{
            fileSize: max_size
        },
        fileFilter: function(req, file, cb) {
            if( file_types.includes(file.mimetype) ){
                cb(null, true);
            } else {
                cb(createError(validation_message));
            }
        }
    });
}


module.exports = uploader;