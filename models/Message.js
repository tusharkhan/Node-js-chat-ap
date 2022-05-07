/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/30/2022
 */

const mongoose = require('mongoose');

const Schema = mongoose.Schema({
    conversation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Conversation',
        required: true
    },
    sender: {
        id: mongoose.Types.ObjectId,
        name: String,
        avatar: String,
    },
    receiver: {
        id: mongoose.Types.ObjectId,
        name: String,
        avatar: String,
    },
    text: {
        type: String,
        required: true,
    },
    isReadBySender: {
        type: Boolean,
        default: false
    },
    isReadByReceiver: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Message', Schema);
