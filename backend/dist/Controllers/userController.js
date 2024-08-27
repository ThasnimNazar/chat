"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addParticipantsToGroup = exports.getMessages = exports.sendMessage = exports.createChat = exports.getUsers = exports.userLogout = exports.userLogin = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userModel_1 = __importDefault(require("../Models/userModel"));
const generateuserToken_1 = __importDefault(require("../Authentication/generateuserToken"));
const chatModel_1 = __importDefault(require("../Models/chatModel"));
const messageModel_1 = __importDefault(require("../Models/messageModel"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phoneno, password, confirmPassword } = req.body;
        if (!name || !email || !phoneno || !password || !confirmPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (password !== confirmPassword) {
            res.status(400).json({ message: 'Password doesn\'t match' });
            return;
        }
        const userExist = yield userModel_1.default.findOne({ email });
        if (userExist) {
            res.status(402).json({ message: 'user already exist' });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = new userModel_1.default({
            name: name,
            email: email,
            phoneno: phoneno,
            password: hashedPassword,
            role: 'user'
        });
        yield user.save();
        const token = (0, generateuserToken_1.default)(res, user._id);
        res.status(200).json({ message: 'successfully completed registeration', user, token });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.registerUser = registerUser;
const userLogin = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'All fields are required' });
            return;
        }
        const user = yield userModel_1.default.findOne({ email });
        if (!user) {
            res.status(402).json({ message: "user dont exists" });
            return;
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }
        (0, generateuserToken_1.default)(res, user === null || user === void 0 ? void 0 : user._id);
        res.status(200).json({ message: 'user logged in successfully', user });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
exports.userLogin = userLogin;
const userLogout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('logout');
        res.cookie('userjwt', '', {
            httpOnly: true,
            expires: new Date(0)
        });
        res.status(200).json({ message: 'logout user' });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
exports.userLogout = userLogout;
const getUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!req.user) {
            res.status(401).json({ message: 'user not authenticated' });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
        const users = yield userModel_1.default.find({
            _id: {
                $ne: userId
            },
        }).select('-password');
        res.status(200).json({ users });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
exports.getUsers = getUsers;
const createChat = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, isGroupChat, groupName, groupDescription } = req.body;
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const senderId = req.user._id;
        if (isGroupChat) {
            console.log('hey');
            if (!groupName || !groupDescription) {
                return res.status(400).json({ message: 'Group name and description are required for group chats' });
            }
            let chat = yield chatModel_1.default.findOne({
                isGroupChat: true,
                groupName
            });
            if (!chat) {
                chat = new chatModel_1.default({
                    isGroupChat: true,
                    groupName,
                    groupDescription,
                    participants: [senderId],
                    messages: []
                });
                yield chat.save();
            }
            console.log(chat, 'chat');
            return res.status(201).json(chat);
        }
        else {
            let chat = yield chatModel_1.default.findOne({
                senderId: senderId,
                receiverId: userId
            });
            if (!chat) {
                chat = yield chatModel_1.default.findOne({
                    senderId: userId,
                    receiverId: senderId
                });
            }
            if (!chat) {
                chat = new chatModel_1.default({
                    senderId: senderId,
                    receiverId: userId,
                    messages: []
                });
                yield chat.save();
            }
            return res.status(201).json(chat);
        }
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.createChat = createChat;
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, senderId, content, timestamp } = req.body;
        if (!chatId || !senderId || !content || !timestamp) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const message = new messageModel_1.default({
            chatId: chatId,
            senderId: senderId,
            text: content,
            timestamp: new Date(timestamp),
        });
        yield message.save();
        console.log(message, 'msg');
        yield chatModel_1.default.findByIdAndUpdate(chatId, {
            $push: { messages: message._id }
        }, { new: true });
        res.status(200).json({ message });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: error.message });
        }
        else {
            console.error('An unknown error occurred');
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.sendMessage = sendMessage;
const getMessages = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId } = req.params;
        const page = parseInt(req.query.page, 10) || 1; // Default to page 1
        const limit = parseInt(req.query.limit, 10) || 10; // Default to limit 10
        console.log(`Chat ID: ${chatId}, Page: ${page}, Limit: ${limit}`);
        const skip = (page - 1) * limit;
        console.log(`Skip: ${skip}`);
        const messages = yield messageModel_1.default.find({ chatId })
            .sort({ timestamp: -1 }) // Sort by newest first
            .skip(skip) // Pagination logic
            .limit(limit); // Limit the number of results
        res.status(200).json({ messages });
    }
    catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
            res.status(500).json({ message: error.message });
        }
        else {
            console.error('An unknown error occurred');
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
}));
exports.getMessages = getMessages;
const addParticipantsToGroup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { chatId, participantIds } = req.body;
        console.log(req.body, 'body');
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!chatId || !Array.isArray(participantIds) || participantIds.length === 0) {
            return res.status(400).json({ message: 'Invalid chat ID or participant IDs' });
        }
        const chat = yield chatModel_1.default.findById(chatId);
        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }
        chat.participants = Array.from(new Set([...chat.participants, ...participantIds]));
        yield chat.save();
        res.status(200).json({ message: 'Participants added successfully', chat });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(500).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: 'An unknown error occurred' });
        }
    }
});
exports.addParticipantsToGroup = addParticipantsToGroup;
