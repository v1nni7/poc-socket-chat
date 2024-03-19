import app from './app'
import { Server } from 'socket.io'
import { createServer } from 'http'
import { roomHandler } from './room'

const server = createServer(app)

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

io.on('connection', (socket) => {
  roomHandler(socket)

  socket.on('disconnect', () => {
    console.log('Usuário desconectado')
  })
})

export default server

// io.on('connection', (socket) => {
//   socket.emit('me', socket.id)

//   socket.on('disconnect', () => {
//     socket.broadcast.emit('callEnded')
//   })

//   socket.on('callUser', (data) => {
//     io.to(data.userToCall).emit('callUser', {
//       signal: data.signalData,
//       from: data.from,
//       name: data.name,
//     })
//   })

//   socket.on('answerCall', (data) => {
//     io.to(data.to).emit('callAccepted', data.signal)
//   })
// })
