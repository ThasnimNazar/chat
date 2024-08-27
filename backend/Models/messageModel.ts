import mongoose, { Schema, Types, Document, model } from 'mongoose';

interface Message extends Document {
    chatId: Types.ObjectId;
    senderId: Types.ObjectId;
    text: string;
    createdAt: Date;
    timestamp: Date;
}

const messageSchema = new Schema<Message>({
    chatId: {
        type: Schema.Types.ObjectId,
        ref: 'Chat',
    },
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    text: {
        type: String,
    },
    timestamp: {
        type: Date,
        default:Date.now
    }
});

const Message = model<Message>('Message', messageSchema);
export default Message;
