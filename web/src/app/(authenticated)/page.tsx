'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Video, VideoOff } from 'lucide-react'

import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useSession } from '@/context/session-context'
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogDescription,
} from '@/components/ui/dialog'
import { ws } from '@/utils/ws'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { push } = useRouter()
  const { user } = useSession()

  const [roomId, setRoomId] = useState('')
  const [onCamera, setOnCamera] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [loadingCamera, setLoadingCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  const handleCreateRoom = () => {
    ws.emit('create-room')
  }

  const handleJoinRoom = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    push(`/sala/${roomId}`)
  }

  const handleToggleCamera = useCallback(async () => {
    const permission = await navigator.permissions.query({
      name: 'camera' as PermissionName,
    })

    if (permission.state === 'denied') {
      setShowModal(true)

      navigator.permissions
        .query({ name: 'camera' as PermissionName })
        .then((permission) => {
          permission.addEventListener('change', (event: Event) => {
            if ((event.target as PermissionStatus)?.state === 'granted') {
              setShowModal(false)
            }
          })
        })

      return
    }

    if (onCamera) {
      stream?.getTracks().forEach((track) => {
        track.stop()
      })

      setStream(null)
    } else {
      setLoadingCamera(true)

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      })

      setStream(mediaStream)
      setLoadingCamera(false)
    }

    setOnCamera((prev) => !prev)
  }, [onCamera, stream])

  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream
    }

    return () => {
      stream?.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }, [stream])

  return (
    <>
      <main className="relative flex h-screen items-center">
        <section className="mx-auto w-full max-w-4xl">
          <div className="mt-12">
            <div className="grid grid-cols-2 gap-6">
              <div className="flex flex-col justify-center space-y-6">
                <h1>
                  Olá, <span className="font-bold">{user.name}</span>!
                  Bem-vindo(a) à <span className="font-bold">NanoMeet</span>!
                </h1>

                <p>
                  Crie ou entre em uma sala para começar a conversar com seus
                  amigos.
                </p>

                <form
                  onSubmit={handleJoinRoom}
                  className="flex items-center gap-2"
                >
                  <Input
                    type="text"
                    className="flex-1"
                    placeholder="Código da sala"
                    onChange={(event) => setRoomId(event.target.value)}
                  />

                  <Button type="submit">Entrar</Button>
                </form>

                <Button
                  type="button"
                  variant="outline"
                  className="self-start"
                  onClick={handleCreateRoom}
                >
                  Criar sala
                </Button>
              </div>
              <div className="flex flex-col items-center justify-items-center">
                {!loadingCamera ? (
                  <>
                    {stream ? (
                      <div className="relative h-80">
                        <video
                          autoPlay
                          className="h-full w-full rounded-2xl"
                          ref={videoRef}
                        />

                        <Button
                          size="sm"
                          type="button"
                          variant="destructive"
                          onClick={handleToggleCamera}
                          className="absolute bottom-2 right-2"
                        >
                          <VideoOff className="size-5" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex h-72 w-full flex-col items-center justify-center gap-4 rounded-2xl border bg-muted">
                        <h3>Ative a câmera para pré-visualizar</h3>
                        <Button
                          onClick={handleToggleCamera}
                          className="flex items-center gap-2"
                        >
                          <Video />
                          <span>Pré-visualizar</span>
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex h-80 items-center justify-center gap-2">
                    Carregando
                    <Loading color="#000000" darkColor="#ffffff" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <div className="absolute bottom-0 left-0 flex w-full items-center justify-center p-4">
          <div className="flex items-center gap-4 rounded-md border p-2 shadow">
            <h2 className="font-semibold">Autenticado: {user.id}</h2>

            <Button type="button" variant="outline">
              Fechar
            </Button>
          </div>
        </div>
      </main>

      <Dialog
        open={showModal}
        onOpenChange={(modalState) => setShowModal(modalState)}
      >
        <DialogContent>
          <DialogHeader>Permissão negada</DialogHeader>

          <DialogDescription>
            Para ativar a câmera, você precisa permitir o acesso à câmera em
            suas configurações do navegador ou do dispositivo.
          </DialogDescription>

          <DialogFooter>
            <Button type="button" onClick={() => setShowModal(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
