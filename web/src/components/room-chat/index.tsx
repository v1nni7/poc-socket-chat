'use client'

import { useState } from 'react'


import { IMessage } from '@/types/chat'
import { useChat } from '@/context/chat-context'
import { useRoom } from '@/context/room-context'
import { useUser } from '@/context/user-context'

import ChatBubble from './chat-bubble'
import { IoSend } from 'react-icons/io5'

export default function Chat() {
  const { roomId } = useRoom()
  const { userId } = useUser()
  const { chat, sendMessage } = useChat()

  const [message, setMessage] = useState('')

  return (
    <>
      <div className="chat-scrollbar mb-4 h-full space-y-2 overflow-y-scroll">
        {chat.messages.map((message: IMessage) => (
          <ChatBubble
            message={message}
            key={message.timestamp + (message.author || 'Anonimo')}
          />
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(message, roomId, userId)
          setMessage('')
        }}
        className="relative flex items-center"
      >
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="chat-scrollbar w-full resize-none rounded-xl bg-slate-800 p-2 pr-10 text-slate-300 outline-none"
        />

        <button
          type="submit"
          className="absolute right-2 text-2xl text-slate-500"
        >
          <IoSend />
        </button>
      </form>
    </>
  )
}
