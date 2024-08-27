"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateUserToken = (res, userId) => {
    const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_USER_SECRET, {
        expiresIn: '30d',
    });
    console.log(token, 'token');
    res.cookie('userjwt', token, {
        httpOnly: false,
        secure: false,
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    return token;
};
exports.default = generateUserToken;
