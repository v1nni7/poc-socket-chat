import { useChat } from '@/context/chat-context'
import { IMessage } from '@/types/chat'
import ChatBubble from './chat-bubble'
import ChatInput from './chat-input'

export default function Chat() {
  const { chat } = useChat()

  return (
    <div className="flex h-full flex-col justify-between" data-testid="chat">
      <div>
        {chat.messages.map((message: IMessage) => (
          <ChatBubble
            message={message}
            key={message.timestamp + (message?.author || 'Anonimo')}
          />
        ))}
      </div>
      <ChatInput />
    </div>
  )
}
