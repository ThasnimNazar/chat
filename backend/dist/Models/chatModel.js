"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const chatSchema = new mongoose_1.Schema({
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Message'
        }],
    isGroupChat: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String
    },
    groupDescription: {
        type: String
    },
    participants: [{
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        }],
});
const Chat = (0, mongoose_1.model)('Chat', chatSchema);
exports.default = Chat;
