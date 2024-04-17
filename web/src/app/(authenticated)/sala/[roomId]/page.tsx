'use client'

import { useEffect } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Copy, Mic, MicOff, User, Video, VideoOff } from 'lucide-react'

import { ws } from '@/utils/ws'

import { Button } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import VideoPlayer from '@/components/video-player'
import VideoPlayerGrid from '@/components/video-player-grid'

import { useRoom } from '@/context/room-context'
import { useSession } from '@/context/session-context'
import { PeerState } from '@/reducers/peer-reducer'

type RoomPageProps = {
  params: {
    roomId: string
  }
}

export default function RoomPage({ params: { roomId } }: RoomPageProps) {
  const {
    peers,
    stream,
    setStream,
    setRoomId,
    handleToggleMic,
    handleToggleCamera,
  } = useRoom()

  const { user } = useSession()

  useEffect(() => {
    if (user.id && user.name) {
      ws.emit('join-room', { roomId, peerId: user.id, userName: user.name })
    }
  }, [roomId, user])

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: {
          autoGainControl: true,
          echoCancellation: true,
          noiseSuppression: true,
        },
      })
      .then((mediaStream) => setStream(mediaStream))
  }, [])

  useEffect(() => {
    setRoomId(roomId || '')
  }, [roomId, setRoomId])

  const peersToShow = Object.values(peers as PeerState).filter(
    ({ peerId }) => peerId !== user.id,
  )

  return (
    <>
      <section className="relative flex h-screen flex-col p-4">
        <h2>
          <span className="mr-2">ID da sala: {roomId}</span>

          <Button variant="outline" size="icon">
            <CopyToClipboard
              text={roomId}
              onCopy={() => {
                toast({
                  title: 'ID da sala copiado',
                  description:
                    'Agora você pode compartilhar o ID da sala com seus amigos',
                })
              }}
            >
              <Copy className="size-4" />
            </CopyToClipboard>
          </Button>
        </h2>

        <VideoPlayerGrid length={peersToShow.length}>
          {stream && stream.getVideoTracks().length > 0 ? (
            <div>
              <div className="relative">
                <VideoPlayer stream={stream} />

                <div className="absolute left-0 top-0 flex h-full w-full items-end">
                  <span className="w-full p-2 text-white">Você</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-muted">
              <span className="block rounded-full bg-muted-foreground p-6">
                <User className="size-12 text-white" />
              </span>

              <div className="absolute bottom-4 left-4">Você</div>
            </div>
          )}

          {peersToShow.map((peer) => (
            <div key={peer.peerId + new Date().getTime()}>
              {peer.stream && peer.stream.getVideoTracks().length > 0 ? (
                <>
                  <div className="relative">
                    <VideoPlayer stream={peer.stream} />

                    <div className="absolute left-0 top-0 flex h-full w-full items-end">
                      <span className="w-full p-2 text-white">
                        {peer.userName}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative flex h-full w-full items-center justify-center rounded-xl border bg-muted">
                  <span className="block rounded-full bg-muted-foreground p-6">
                    <User className="size-12 text-white" />
                  </span>

                  <div className="absolute bottom-4 left-4">
                    {peer.userName}
                  </div>
                </div>
              )}
            </div>
          ))}
        </VideoPlayerGrid>

        <div className="flex items-center justify-center gap-2 py-4">
          <Button
            size="icon"
            type="button"
            variant="outline"
            onClick={handleToggleMic}
          >
            {stream && stream?.getAudioTracks().length > 0 ? (
              <Mic className="size-4" />
            ) : (
              <MicOff className="size-4" />
            )}
          </Button>

          <Button
            size="icon"
            type="button"
            variant="outline"
            onClick={handleToggleCamera}
          >
            {stream && stream?.getVideoTracks().length > 0 ? (
              <Video className="size-4" />
            ) : (
              <VideoOff className="size-4" />
            )}
          </Button>
        </div>

        <div className="absolute bottom-4 left-4">
          <div className="rounded-md border p-2">StreamId: {stream?.id}</div>
        </div>
      </section>
    </>
  )
}
