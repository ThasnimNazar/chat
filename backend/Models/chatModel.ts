import mongoose, { Schema, Types, Document, model } from 'mongoose';

interface Chat extends Document {
    senderId: Types.ObjectId;
    receiverId: Types.ObjectId;
    messages: Types.ObjectId[];
    isGroupChat: boolean;        // Flag to indicate if it's a group chat
    groupName?: string;          // Optional name of the group
    groupDescription?: string;
    participants: Types.ObjectId[];
}

const chatSchema = new Schema<Chat>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    messages: [{
        type: Schema.Types.ObjectId,
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
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
});

const Chat = model<Chat>('Chat', chatSchema);
export default Chat;
