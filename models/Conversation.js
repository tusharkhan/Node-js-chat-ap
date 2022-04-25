/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/25/2022
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema({
        creator: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String
        },
        participant: {
            id: mongoose.Types.ObjectId,
            name: String,
            avatar: String
        },
        last_update: {
            type: Date,
            default: Date.now
        },
    },
    {
        timestamps: true
    });


module.exports = mongoose.model('Conversation', Schema);