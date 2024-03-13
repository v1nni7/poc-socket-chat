import server from './socket'

const port = process.env.PORT || 3000

server.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`)
})
