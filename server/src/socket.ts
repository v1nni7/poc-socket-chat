import http from "http";
import { Server } from "socket.io";
import app from "./app";

const server = http.createServer(app);

const rooms = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }) => {
    socket.join(room);

    socket.emit("message", {
      message: `Welcome to ${room}, ${username}!`,
      sender: "admin",
    });

    socket.broadcast.to(room).emit("message", {
      message: `${username} has joined the room!`,
      sender: "admin",
    });
  });

  socket.on("message", ({ message, sender, room}) => {
    console.log(message, sender, room)
    io.to(room).emit("message", { message, sender });
  })
});

export default server;
