import { ReactNode } from 'react'
import { RoomProvider } from '@/context/room-context'

export default function AutheticatedLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <RoomProvider>{children}</RoomProvider>
    </>
  )
}
