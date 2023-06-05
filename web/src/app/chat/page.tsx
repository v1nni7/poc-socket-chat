"use client";

import { io } from "socket.io-client";
import { IoSend } from "react-icons/io5";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Chat() {
  const [room, setRoom] = useState<string | null>(null);
  const username = localStorage.getItem("username");
  const [messages, setMessages] = useState<any[]>([]);

  const joinRoom = (roomName: string) => {
    socket.emit("join", { username, room: roomName });
    setRoom(roomName);
  };

  const socket = useMemo(() => {
    return io("http://localhost:4000/");
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const message = e.currentTarget[0].value;

      try {
        socket.emit("message", { username, message, room });

        e.currentTarget[0].value = "";
      } catch (error) {
        console.log(error);
      }
    },
    [username, room, socket]
  );

  useEffect(() => {
    setMessages([]);

    const handleNewMessage = (message: string) => {
      setMessages((messages) => [...messages, message]);
    };

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    };
  }, [socket, username, room]);

  return (
    <div className="flex h-full w-full">
      <div className="border-r w-1/5 border-neutral-700/20 flex flex-col gap-2 p-2">
        <button
          onClick={() => joinRoom("global")}
          className="text-neutral-200 font-semibold bg-violet-500/80 px-6 py-1 rounded-lg hover:bg-violet-500/60"
        >
          Global
        </button>
        <button
          onClick={() => joinRoom("private")}
          className="text-neutral-200 font-semibold bg-violet-500/80 px-6 py-1 rounded-lg hover:bg-violet-500/60"
        >
          Privado
        </button>
      </div>
      <div className="w-4/5 h-full p-2">
        {room ? (
          <div className="flex flex-col gap-2 h-full">
            <div className="bg-neutral-700/50 p-2 rounded-lg w-full h-full flex flex-col gap-2 justify-end">
              {messages.length
                ? messages.map(({ message, sender }, index) => (
                    <div
                      key={index}
                      className="max-w-[50%] bg-neutral-700/80 p-2 rounded-lg text-neutral-400"
                    >
                      {message}
                    </div>
                  ))
                : "Nenhuma mensagem"}
            </div>

            <form
              onSubmit={handleSubmit}
              className="my-2 w-full flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Digite sua mensagem"
                className="w-full rounded-lg p-2 text-neutral-500 placeholder:text-neutral-500 placeholder:font-semibold bg-transparent border-2 border-neutral-700 outline-none focus:border-neutral-600 transition-colors"
              />
              <button className="bg-violet-500 h-full px-6 rounded-lg hover:bg-violet-500/50 transition-colors">
                <IoSend className="text-2xl text-neutral-300" />
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full w-full flex items-center justify-center">
            <h2 className="text-neutral-200">Selecione uma sala</h2>
          </div>
        )}
      </div>
    </div>
  );
}
