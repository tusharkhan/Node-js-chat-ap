/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/9/2022
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email: {
        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    role:{
        type:String,
        default:'user',
        enum: ['admin', 'user']
    }
}, {
    timestamps:true
});


module.exports = mongoose.model('People', Schema);