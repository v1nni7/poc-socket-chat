"use client";

import { io } from "socket.io-client";
import { IoSendSharp } from "react-icons/io5";
import { useEffect, useMemo, useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const value = e.currentTarget[0].value;

    try {
      socket.emit("message", value);

      e.currentTarget[0].value = "";
    } catch (error) {
      console.log(error);
    }
  };

  const socket = useMemo(() => {
    return io("http://localhost:4000", {
      withCredentials: true,
      extraHeaders: {
        "my-custom-header": "abcd",
      },
    });
  }, []);

  useEffect(() => {
    const handleNewMessage = (message:string) => {
      setMessages((messages) => [...messages, message]);
    }

    socket.on("message", handleNewMessage);

    return () => {
      socket.off("message", handleNewMessage);
    }
  }, [socket])

  return (
    <main className="flex items-center justify-center h-screen">
      <div className="w-96 p-2 rounded-lg bg-neutral-800">
        <div className="flex flex-col">
          <div className="flex flex-col text-neutral-300">
            {messages.map((message, index) => (
              <div className="" key={index}>
                {message}
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full p-2 text-lg text-neutral-400 placeholder:text-neutral-500 rounded-lg bg-transparent border-2 border-neutral-600 outline-none focus:border-neutral-500 transition-colors"
            />
            <button type="submit">
              <IoSendSharp className="text-2xl text-neutral-500" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
