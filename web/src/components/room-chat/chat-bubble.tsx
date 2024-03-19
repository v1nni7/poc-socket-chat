import classNames from 'classnames'

import { IMessage } from '@/types/chat'
import { useUser } from '@/context/user-context'
import { useRoom } from '@/context/room-context'

export default function ChatBubble({ message }: { message: IMessage }) {
  const { peers } = useRoom()
  const { userId } = useUser()

  const author = message.author && peers[message.author]?.userName
  const isSelf = message.author === userId

  return (
    <div
      className={classNames('flex', {
        'ml-12 justify-end': isSelf,
        'mr-12 justify-start': !isSelf,
      })}
    >
      <div
        className={classNames('text-md max-w-full', {
          'ml-12 rounded-s-2xl rounded-t-2xl bg-blue-800': isSelf,
          'mr-12 rounded-e-2xl rounded-t-2xl bg-slate-800': !isSelf,
        })}
      >
        {!isSelf && (
          <div className="px-2 pt-2 text-xs text-slate-400">~ {author}</div>
        )}
        <p className="break-words p-2">{message.content}</p>
      </div>
    </div>
  )
}
