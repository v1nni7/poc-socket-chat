'use client'

import {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

import Peer from 'peerjs'
import { ws } from '@/utils/ws'
import { peersReducer, PeerState } from '@/reducers/peer-reducer'
import {
  removePeerAction,
  addAllPeersAction,
  addPeerNameAction,
  addPeerStreamAction,
  removePeerStreamAction,
} from '@/reducers/peer-actions'

import { IPeer } from '@/types/peer'
import { useRouter } from 'next/navigation'
import { useSession } from './session-context'

interface RoomValue {
  stream?: MediaStream
  setStream: Dispatch<SetStateAction<MediaStream | undefined>>
  peers: PeerState
  roomId: string
  handleToggleMic: () => void
  handleToggleCamera: () => void
  setRoomId: (id: string) => void
  handleUserJoined: () => void
  handleDisconnectUser: () => void
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  setRoomId: () => {},
  setStream: () => {},
  roomId: '',
  handleToggleMic: () => {},
  handleToggleCamera: () => {},
  handleUserJoined: () => {},
  handleDisconnectUser: () => {},
})

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter()
  const { user } = useSession()
  const [me, setMe] = useState<Peer>()
  const [audio, setAudio] = useState(true)
  const [video, setVideo] = useState(true)
  const [stream, setStream] = useState<MediaStream>()
  const [peers, dispatch] = useReducer(peersReducer, {})
  const [roomId, setRoomId] = useState<string>('')

  const enterRoom = ({ roomId }: { roomId: 'string' }) => {
    push(`/sala/${roomId}`)
  }
  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>
  }) => {
    dispatch(addAllPeersAction(participants))
  }

  const removePeer = (peerId: string) => {
    dispatch(removePeerAction(peerId))
  }

  const removePeerStream = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId))
  }

  const handleToggleCamera = useCallback(async () => {
    if (stream?.getVideoTracks().length === 0) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio,
      })

      setVideo(true)
      setStream(mediaStream)

      ws.emit('user-start-camera', {
        peerId: user.id,
        roomId,
      })
    } else {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio,
      })

      setVideo(false)
      setStream(mediaStream)

      ws.emit('user-stop-camera', { peerId: user.id, roomId })
    }
  }, [stream, user.id, roomId, audio])

  const handleToggleMic = useCallback(async () => {
    if (stream?.getAudioTracks().length === 0) {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: true,
      })

      setAudio(true)
      setStream(mediaStream)

      ws.emit('user-start-audio', {
        peerId: user.id,
        roomId,
      })
    } else {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: false,
      })

      setAudio(false)
      setStream(mediaStream)

      ws.emit('user-stop-audio', { peerId: user.id, roomId })
    }
  }, [stream, user.id, roomId, video])

  useEffect(() => {
    const fn = async () => {
      const PeerJs = (await import('peerjs')).default

      if (!user.id) return

      const peer = new PeerJs(user.id, {
        host: 'localhost',
        port: 9000,
        path: '/myapp',
      })

      setMe(peer)
    }

    fn()

    ws.on('room-created', enterRoom)
    ws.on('get-users', getUsers)
    ws.on('user-disconnected', removePeer)

    return () => {
      ws.off('room-created')
      ws.off('get-users')
      ws.off('user-disconnected')
      ws.off('user-joined')
      ws.off('user-started-camera')
      ws.off('user-stopped-camera')
      me?.disconnect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleUserJoined = useCallback(() => {
    if (!me) return
    if (!stream) return

    ws.on('user-joined', ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName: user.name,
        },
      })

      call.on('stream', (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream))
      })

      dispatch(addPeerNameAction(peerId, name))
    })

    me.on('call', (call) => {
      const { userName } = call.metadata

      dispatch(addPeerNameAction(call.peer, userName))
      call.answer(stream)

      call.on('stream', (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream))
      })
    })

    return () => {
      ws.off('user-joined')
    }
  }, [me, stream, user.name])

  useEffect(() => {
    ws.on('user-started-camera', ({ peerId }) => {
      console.log('Usuário ' + peerId + ' ligou a camera')

      if (!me) return
      if (!stream) return

      const call = me?.call(peerId, stream, {
        metadata: {
          userName: user.name,
        },
      })

      call.on('stream', (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream))
      })
    })

    ws.on('user-stopped-audio', ({ peerId }) => {
      if (!me) return
      if (!stream) return

      const call = me?.call(peerId, stream, {
        metadata: {
          userName: user.name,
        },
      })

      call.on('stream', (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream))
      })
    })

    ws.on('user-stopped-camera', removePeerStream)
  }, [handleUserJoined])

  const handleDisconnectUser = () => {
    me?.disconnect()
    push('/')
  }

  useEffect(() => {
    handleUserJoined()
  }, [handleUserJoined])

  return (
    <RoomContext.Provider
      value={{
        stream,
        peers,
        roomId,
        setRoomId,
        setStream,
        handleToggleMic,
        handleUserJoined,
        handleToggleCamera,
        handleDisconnectUser,
      }}
    >
      {children}
    </RoomContext.Provider>
  )
}

export const useRoom = () => {
  const context = useContext(RoomContext)

  if (!context) {
    throw new Error('useUser must be used within a RoomProvider')
  }

  return context
}
