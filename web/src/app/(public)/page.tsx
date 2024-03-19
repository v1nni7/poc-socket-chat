'use client'

import NameInput from '@/components/name-input'
import { ws } from '@/utils/ws'

export default function Home() {
  const createRoom = () => {
    ws.emit('create-room')
  }

  return (
    <>
      <div className="flex h-screen flex-col items-center justify-center">
        <NameInput />
        <button onClick={createRoom}>Iniciar nova chamada</button>
      </div>
    </>
  )
}
