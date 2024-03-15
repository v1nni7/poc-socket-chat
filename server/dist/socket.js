"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const server = (0, http_1.createServer)(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
});
const rooms = {};
// io.on('connection', (socket) => {
//   socket.on('join-room', (data) => {
//     socket.join(data.callURL)
//     console.log('Usuário conectando na sala', data)
//     // Emitir um evento para informar que um usuário se conectou à sala
//     io.to(data.callURL).emit('user-connected', { name: data.name })
//   })
//   socket.on('signal', (data) => {
//     // Transmitir o sinal para o outro peer na sala
//     socket.to(data.room).emit('signal', { signalData: data.signalData })
//   })
// })
exports.default = server;
io.on('connection', (socket) => {
    socket.emit('me', socket.id);
    socket.on('disconnect', () => {
        socket.broadcast.emit('callEnded');
    });
    socket.on('callUser', (data) => {
        io.to(data.userToCall).emit('callUser', {
            signal: data.signalData,
            from: data.from,
            name: data.name,
        });
    });
    socket.on('answerCall', (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    });
});
