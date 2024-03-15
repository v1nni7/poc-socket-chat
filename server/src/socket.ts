import app from './app'
import { Server } from 'socket.io'
import { createServer } from 'http'

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const rooms = {}

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

export default server

io.on('connection', (socket) => {
  socket.emit('me', socket.id)

  socket.on('disconnect', () => {
    socket.broadcast.emit('callEnded')
  })

  socket.on('callUser', (data) => {
    io.to(data.userToCall).emit('callUser', {
      signal: data.signalData,
      from: data.from,
      name: data.name,
    })
  })

  socket.on('answerCall', (data) => {
    io.to(data.to).emit('callAccepted', data.signal)
  })
})
