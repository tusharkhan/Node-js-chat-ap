/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const People = require('../models/Peoples');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');

function showInboxPage(req, res, next) {
    People.find({_id: {$ne: req.user.id}}, function (error, result) {
        if (error) {
            return next(error);
        }

        Conversation.find({
            $or: [
                {"creator.id": req.user.id},
                {"participant.id": req.user.id},
            ]
        }, function (conversationError, conversations) {
            if (conversationError) {
                return next(conversationError);
            } else {
                res.render('inbox', {
                    title: 'Inbox',
                    users: result,
                    loggedInUser: req.user,
                    conversations
                });
            }
        });
    });
}


function createConversation(req, res, next) {
    let requestBody = req.body;
    let creator = mongoose.Types.ObjectId(requestBody.creator);
    let participant = mongoose.Types.ObjectId(requestBody.participant);

    //check if conversation exist
    let query = Conversation.find({
        $or: [
            {"creator.id": creator, "participant.id": participant},
            {"creator.id": participant, "participant.id": creator},
        ]
    }).lean().limit(1);


    // Find the document
    query.exec(function (error, result) {
        if (error) {
            res.status(500).json({
                message: 'Internal Server Error',
                error: error
            });
        }
        // If the document doesn't exist
        if (!result.length) {
            // Create a new one
            People.findById(creator, function (error, result) {
                if (error) {
                    res.status(500).json({
                        message: 'Internal Server Error'
                    });
                } else {
                    People.findById(participant, function (error2, perti) {
                        if (error2) {
                            res.status(500).json({
                                message: 'Internal Server Error'
                            });
                        } else {
                            let conversation = new Conversation({
                                creator: {
                                    id: result._id,
                                    name: result.name,
                                    avatar: result.avatar
                                },
                                participant: {
                                    id: perti._id,
                                    name: perti.name,
                                    avatar: perti.avatar
                                }
                            });

                            conversation.save(function (saveError, saveResult) {
                                if (saveError) {
                                    res.status(500).json({
                                        message: 'Internal Server Error'
                                    });
                                } else {
                                    res.status(201).json({
                                        message: 'Conversation Created',
                                        conversation: saveResult
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }
        // If the document does exist
        else {
            res.status(200).json({
                message: 'Conversation Exist',
                conversation: result[0]
            });
        }
    });

}


async function getUserConversationList(req, res, next) {
    let conversation_id = req.body.conversation_id;

    let conversations = await Message.find({
        conversation_id: conversation_id
    });

    res.status(200).json({
        message: 'Conversation Found',
        conversations
    });
}


async function sendMessage(req, res, next) {
    let sender_id = req.body.sender_id;
    let receiver_id = req.body.receiver_id;
    let conversation_id = req.body.conversation_id;
    let messageText = req.body.message;

    let senderInfo = await People.findById(sender_id);
    let receiverInfo = await People.findById(receiver_id);
    let conversation = await Conversation.findById(conversation_id);

    if (!senderInfo || !receiverInfo || !conversation) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    } else {
        let message = new Message({
            conversation_id: conversation._id,
            sender: {
                id: senderInfo._id,
                name: senderInfo.name,
                avatar: senderInfo.avatar
            },
            receiver: {
                id: receiverInfo._id,
                name: receiverInfo.name,
                avatar: receiverInfo.avatar
            },
            text: messageText
        });

        message.save(function (saveError, saveData) {
            if (saveError) {
                res.status(500).json({
                    message: 'Internal Server Error'
                });
            } else {
                global.io.emit('send_message', {
                    conversation_id: conversation._id,
                    sender: {
                        id: senderInfo._id,
                        name: senderInfo.name,
                        avatar: senderInfo.avatar
                    },
                    receiver: {
                        id: receiverInfo._id,
                        name: receiverInfo.name,
                        avatar: receiverInfo.avatar
                    },
                    text: messageText,
                    created_at: new Date().toISOString()
                });

                res.status(200).json({
                    message: 'Message Sent',
                    data: saveData
                });
            }
        });
    }
}


module.exports = {
    sendMessage,
    showInboxPage,
    createConversation,
    getUserConversationList
};