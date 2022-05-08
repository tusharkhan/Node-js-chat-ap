/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 * http://pornhubvybmsymdol4iibwgwtkpwmeyd6luq2gxajgjzfjvotyt5zhyd.onion/view_video.php?viewkey=ph61f2f0f06c34f
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
        }, async function (conversationError, conversations) {
            if (conversationError) {
                return next(conversationError);
            } else {
                let readUnread = await countReadUnreadMessages(conversations)
                let sendData = {
                    title: 'Inbox',
                    users: result,
                    loggedInUser: req.user,
                    redUnreadMessages: readUnread,
                    conversations
                };

                res.render('inbox', sendData);
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
    let user_id = req.user.id;
    let conversations = await Message.find({
        conversation_id: conversation_id
    });

    for (const conversationsKey in conversations) {
        const query = {_id: conversations[conversationsKey]._id} //your query here
        const update = {} //your update in json here
        const option = {new: true} //will return updated document

        if (user_id === conversations[conversationsKey].sender.id.toString()) {
            update.isReadBySender = true;
        } else {
            update.isReadByReceiver = true;
        }

        await Message.findOneAndUpdate(query, update, option);
    }

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

    let isReadBySender = false;
    let isReadByReceiver = false;

    if (!senderInfo || !receiverInfo || !conversation) {
        res.status(500).json({
            message: 'Internal Server Error'
        });
    } else {

        console.log(sender_id.toString(), receiver_id.toString(), conversation.creator.id.toString(), conversation.participant.id.toString());

        if (sender_id.toString() == conversation.creator.id.toString()) isReadBySender = true;
        else isReadByReceiver = true;

        console.log(isReadBySender, isReadByReceiver);

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
            isReadBySender: isReadBySender,
            isReadByReceiver: isReadByReceiver,
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
                    isReadBySender: isReadBySender,
                    isReadByReceiver: isReadByReceiver,
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


async function countReadUnreadMessages(conversations) {
    let resultMain = [];

    for (const conversation of conversations) {
        let id = conversation.id;
        resultMain[id] = {
            unReadBySender: 0,
            unReadByReceiver: 0
        };

        resultMain[id].unReadBySender = await Message.find({
            conversation_id: conversation._id,
            isReadBySender: false
        }).count();

        resultMain[id].unReadByReceiver = await Message.find({
            conversation_id: conversation._id,
            isReadByReceiver: false
        })
            .count();

    }

    return resultMain;
}


async function deleteUserMessages(req, res, next) {
    let conversation_id = req.body.conversation_id;
    let user_id = req.user.id;
    let deleteConversation = false;

    let converstion = await Conversation.findById(conversation_id);
    let stringId = converstion.creator.id.toString();

    // if one is false then check the other
    // if both are false then delete the conversation
    if (converstion.deleteByCreator === true || converstion.deleteByParticipant === true) {
        if (stringId === user_id.toString()) {
            if (converstion.deleteByCreator !== true && converstion.deleteByParticipant === true)
                deleteConversation = true;
        } else {
            if (converstion.deleteByParticipant !== true && converstion.deleteByCreator === true)
                deleteConversation = true;
        }

        // if both are true then delete the conversation
        // and delete the messages for the conversation
        if (deleteConversation) {
            await Conversation.findByIdAndDelete(conversation_id);
            await Message.deleteMany({conversation_id: conversation_id});

            res.status(200).json({
                message: 'Conversation deleted'
            });
        }

    } else {
        if (stringId === user_id.toString()) converstion.deleteByCreator = true;
        else converstion.deleteByParticipant = true;

        await converstion.save();

        res.status(200).json({
            message: 'Conversation deleted',
            data: converstion
        });
    }


}


module.exports = {
    sendMessage,
    showInboxPage,
    createConversation,
    getUserConversationList,
    deleteUserMessages
};