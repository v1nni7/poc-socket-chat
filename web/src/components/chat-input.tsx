'use client'

import { useChat } from '@/context/chat-context'
import { useRoom } from '@/context/room-context'
import { useUser } from '@/context/user-context'
import { useState } from 'react'
import { IoMdSend } from 'react-icons/io'

export default function ChatInput() {
  const [message, setMessage] = useState('')
  const { sendMessage } = useChat()
  const { userId } = useUser()
  const { roomId } = useRoom()

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          sendMessage(message, roomId, userId)
          setMessage('')
        }}
      >
        <div className="flex">
          <textarea
            className="rounded border"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          >
            <button
              type="submit"
              className="mx-2 rounded-lg bg-rose-400 p-4 text-xl text-white hover:bg-rose-600"
            >
              <IoMdSend />
            </button>
          </textarea>
        </div>
      </form>
    </div>
  )
}
