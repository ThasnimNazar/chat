"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../Controllers/userController");
const userMiddleware_1 = require("../Middlewares/userMiddleware");
const userroute = express_1.default.Router();
userroute.post('/', userController_1.registerUser);
userroute.post('/login', userController_1.userLogin);
userroute.post('/logout', userController_1.userLogout);
userroute.get('/get-users', userMiddleware_1.authenticateUser, userController_1.getUsers);
userroute.post('/create-chat', userMiddleware_1.authenticateUser, userController_1.createChat);
userroute.post('/send-messages', userMiddleware_1.authenticateUser, userController_1.sendMessage);
userroute.get('/get-messages/:chatId', userMiddleware_1.authenticateUser, userController_1.getMessages);
userroute.post('/add-users', userMiddleware_1.authenticateUser, userController_1.addParticipantsToGroup);
exports.default = userroute;
