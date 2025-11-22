import { Server } from 'socket.io'
import http from 'http';
import express from 'express';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173'],
    }
})

export function getReceiverSocketId(userId) {
    return socketUsersMap[userId];
}

const socketUsersMap = {};

io.on('connection', (socket) => {

    const userId = socket.handshake.query.userId;

    if (userId) {
        socketUsersMap[userId] = socket.id;
        console.log(`User ${userId} connected with socket ID: ${socket.id}`);
        io.emit('online-users', Object.keys(socketUsersMap));
    }
    socket.on('disconnect', () => {
        console.log('A user disconnected from socket:', socket.id);

        delete socketUsersMap[userId];
        io.emit('online-users', Object.keys(socketUsersMap));
    });
});

export { io, server, app };



