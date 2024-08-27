import { Server } from 'socket.io';
import http from 'http';

let io: Server;

const initializeSocketIO = (server: http.Server) => {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });


    io.on('connection', (socket) => {
        console.log('hey')
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', ({ roomId }) => {
            socket.join(roomId); 
            console.log(`User with socket ID ${socket.id} joined room ${roomId}`);
          });

        socket.on('sendMessage', (message) => {
            console.log(message,'msg')
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

const getSocketIOInstance = () => io;

export { initializeSocketIO, getSocketIOInstance };
