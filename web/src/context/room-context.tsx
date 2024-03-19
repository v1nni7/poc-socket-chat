import {
  createContext,
  useEffect,
  useState,
  useReducer,
  ReactNode,
  useContext,
  SetStateAction,
  Dispatch,
  useCallback,
} from 'react'

import Peer from 'peerjs'
import { ws } from '@/utils/ws'
import { peersReducer, PeerState } from '@/reducers/peer-reducer'
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from '@/reducers/peer-actions'

import { IPeer } from '@/types/peer'
import { useUser } from './user-context'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'

interface RoomValue {
  stream?: MediaStream
  setStream: Dispatch<SetStateAction<MediaStream | undefined>>
  screenStream?: MediaStream
  peers: PeerState
  shareScreen: () => void
  roomId: string
  setRoomId: (id: string) => void
  screenSharingId: string
  handleUserJoined: () => void
}

export const RoomContext = createContext<RoomValue>({
  peers: {},
  shareScreen: () => {},
  setRoomId: () => {},
  setStream: () => {},
  screenSharingId: '',
  roomId: '',
  handleUserJoined: () => {},
})

export const RoomProvider = ({ children }: { children: ReactNode }) => {
  const { push } = useRouter()
  const { userName, userId } = useUser()
  const [me, setMe] = useState<Peer>()
  const [stream, setStream] = useState<MediaStream>()
  const [screenStream, setScreenStream] = useState<MediaStream>()
  const [peers, dispatch] = useReducer(peersReducer, {})
  const [screenSharingId, setScreenSharingId] = useState<string>('')
  const [roomId, setRoomId] = useState<string>('')

  const enterRoom = ({ roomId }: { roomId: 'string' }) => {
    push(`/room/${roomId}`)
  }
  const getUsers = ({
    participants,
  }: {
    participants: Record<string, IPeer>
  }) => {
    dispatch(addAllPeersAction(participants))
  }

  const removePeer = (peerId: string) => {
    dispatch(removePeerStreamAction(peerId))
  }

  const switchStream = (stream: MediaStream) => {
    Object.values(me?.connections || {}).forEach((connection: any) => {
      const videoTrack: any = stream
        ?.getTracks()
        .find((track) => track.kind === 'video')
      connection[0].peerConnection
        .getSenders()
        .find((sender: any) => sender.track.kind === 'video')
        .replaceTrack(videoTrack)
        .catch((err: any) => console.error(err))
    })
  }

  const shareScreen = () => {
    if (userId === screenSharingId) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          switchStream(stream)
          setScreenSharingId('')

          screenStream?.getVideoTracks()[0].stop()
        })

      return
    }

    if (screenSharingId) {
      toast.error(
        'Não é possível compartilhar a tela enquanto outra pessoa está compartilhando',
      )
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream)
        setScreenStream(stream)
        setScreenSharingId(me?.id || '')
      })
    }
  }

  useEffect(() => {
    if (screenStream) {
      screenStream.getVideoTracks()[0].onended = () => {
        shareScreen()
      }
    }
  }, [screenStream])

  const nameChangedHandler = ({
    peerId,
    userName,
  }: {
    peerId: string
    userName: string
  }) => {
    dispatch(addPeerNameAction(peerId, userName))
  }

  useEffect(() => {
    ws.emit('change-name', { peerId: userId, userName, roomId })
  }, [userName, userId, roomId])

  useEffect(() => {
    const peer = new Peer(userId, {
      host: 'localhost',
      port: 9000,
      path: '/myapp',
    })

    setMe(peer)

    ws.on('room-created', enterRoom)
    ws.on('get-users', getUsers)
    ws.on('user-disconnected', removePeer)
    ws.on('user-started-sharing', (peerId) => setScreenSharingId(peerId))
    ws.on('user-stopped-sharing', () => setScreenSharingId(''))
    ws.on('name-changed', nameChangedHandler)

    return () => {
      ws.off('room-created')
      ws.off('get-users')
      ws.off('user-disconnected')
      ws.off('user-started-sharing')
      ws.off('user-stopped-sharing')
      ws.off('user-joined')
      ws.off('name-changed')
      me?.disconnect()
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (screenSharingId) {
      ws.emit('start-sharing', { peerId: screenSharingId, roomId })
    } else {
      ws.emit('stop-sharing', roomId)
    }
  }, [screenSharingId, roomId])

  const handleUserJoined = useCallback(() => {
    if (!me) return
    if (!stream) return

    ws.on('user-joined', ({ peerId, userName: name }) => {
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
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
  }, [me, stream, userName])

  return (
    <RoomContext.Provider
      value={{
        stream,
        screenStream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        setStream,
        screenSharingId,
        handleUserJoined,
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
