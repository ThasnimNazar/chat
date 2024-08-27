"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const messageSchema = new mongoose_1.Schema({
    chatId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Chat',
    },
    senderId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});
const Message = (0, mongoose_1.model)('Message', messageSchema);
exports.default = Message;
