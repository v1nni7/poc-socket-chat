'use client'

import { useRoom } from '@/context/room-context'
import { useUser } from '@/context/user-context'
import { IMessage } from '@/types/chat'
import classNames from 'classnames'

export default function ChatBubble({ message }: { message: IMessage }) {
  const { peers } = useRoom()
  const { userId } = useUser()

  const author = message.author && peers[message.author].userName
  const userName = author || 'Anonimo'
  const isSelf = message.author === userId
  const time = new Date(message.timestamp).toLocaleTimeString()

  return (
    <div
      className={classNames('m-2 flex', {
        'justify-end pl-10': isSelf,
        'justify-start pr-10': !isSelf,
      })}
    >
      <div className="flex flex-col">
        <div
          className={classNames('inline-block rounded px-4 py-2', {
            'bg-red-200': isSelf,
            'bg-red-300': !isSelf,
          })}
        >
          {message.content}
          <div
            className={classNames('text-xs, opacity-50', {
              'text-right': isSelf,
              'text-left': !isSelf,
            })}
          >
            {time}
          </div>
        </div>
        <div
          className={classNames('text-md', {
            'text-right': isSelf,
            'text-left': !isSelf,
          })}
        >
          {isSelf ? 'You' : userName}
        </div>
      </div>
    </div>
  )
}
