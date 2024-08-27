"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketIOInstance = exports.initializeSocketIO = void 0;
const socket_io_1 = require("socket.io");
let io;
const initializeSocketIO = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
        console.log('hey');
        console.log('A user connected:', socket.id);
        socket.on('joinRoom', ({ roomId }) => {
            socket.join(roomId);
            console.log(`User with socket ID ${socket.id} joined room ${roomId}`);
        });
        socket.on('sendMessage', (message) => {
            console.log(message, 'msg');
            const { chat } = message;
            io.to(chat).emit('receiveMessage', message);
            console.log(`Message sent to room ${chat}:`, message);
        });
        socket.on('error', (err) => {
            console.error('Socket error:', err);
        });
    });
    return io;
};
exports.initializeSocketIO = initializeSocketIO;
const getSocketIOInstance = () => io;
exports.getSocketIOInstance = getSocketIOInstance;
