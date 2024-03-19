'use client'

import { ReactNode } from 'react'
import { ChatProvider } from '@/context/chat-context'
import { RoomProvider } from '@/context/room-context'
import { UserProvider } from '@/context/user-context'

export default function Provider({ children }: { children: ReactNode }) {
  return (
    <UserProvider>
      <RoomProvider>
        <ChatProvider>{children}</ChatProvider>
      </RoomProvider>
    </UserProvider>
  )
}
