import socketIOClient from 'socket.io-client'

export const WS = 'http://localhost:5000'
export const ws = socketIOClient(WS)
