'use client'

import {
  createContext,
  useEffect,
  useReducer,
  type ReactNode,
  useContext,
} from 'react'
import { IMessage } from '@/types/chat'
import { chatReducer, type ChatState } from '@/reducers/chat-reducer'
import {
  addHistoryAction,
  addMessageAction,
  toggleChatAction,
} from '@/reducers/chat-actions'
import { ws } from '@/utils/ws'

interface ChatValue {
  chat: ChatState
  sendMessage: (message: string, roomId: string, author: string) => void
  toggleChat: () => void
}

export const ChatContext = createContext<ChatValue>({
  chat: {
    messages: [],
    isChatOpen: false,
  },
  sendMessage: () => {},
  toggleChat: () => {},
})

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [chat, chatDispatch] = useReducer(chatReducer, {
    messages: [],
    isChatOpen: false,
  })

  const sendMessage = (message: string, roomId: string, author: string) => {
    const messagesData: IMessage = {
      content: message,
      timestamp: new Date().getTime(),
      author,
    }

    chatDispatch(addMessageAction(messagesData))

    ws.emit('send-message', roomId, messagesData)
  }

  const addMessage = (message: IMessage) => {
    chatDispatch(addMessageAction(message))
  }

  const addHistory = (messages: IMessage[]) => {
    chatDispatch(addHistoryAction(messages))
  }

  const toggleChat = () => {
    chatDispatch(toggleChatAction(!chat.isChatOpen))
  }

  useEffect(() => {
    ws.on('add-message', addMessage)
    ws.on('get-messages', addHistory)

    return () => {
      ws.off('add-message', addMessage)
      ws.off('get-messages', addHistory)
    }
  }, [])

  return (
    <ChatContext.Provider value={{ chat, sendMessage, toggleChat }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChat = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }

  return context
}
