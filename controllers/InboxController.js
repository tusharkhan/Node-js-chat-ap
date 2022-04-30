/**
 * created by: tushar Khan
 * email : tushar.khan0122@gmail.com
 * date : 4/8/2022
 */

const People = require('../models/Peoples');
const mongoose = require('mongoose');
const Conversation = require('../models/Conversation');

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
                            res.status(200).json({
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


module.exports = {
    showInboxPage,
    createConversation
};