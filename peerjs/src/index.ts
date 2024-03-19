import { PeerServer } from "peer";

PeerServer({ port: 9001, path: "/" }, () => {
  console.log("Servidor peer rodando!")
})