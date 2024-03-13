'use client'

import Peer from 'simple-peer'
import { useEffect, useRef, useState } from 'react'
import { connect } from 'socket.io-client'

const socket = connect('http://localhost:5000')
export default function Home() {
  const [me, setMe] = useState('')
  const [name, setName] = useState('')
  const [caller, setCaller] = useState('')
  const [callEnded, setCallEnded] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callerSignal, setCallerSignal] = useState('')
  const [receivingCall, setReceivingCall] = useState(false)
  const [stream, setStream] = useState<MediaStream | undefined>()

  const myVideo = useRef<HTMLVideoElement>(null)
  const userVideo = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef()

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        if (myVideo.current) myVideo.current.srcObject = stream
      })

    socket.on('me', (id) => {
      setMe(id)
    })

    socket.on('callUser', (data) => {
      setReceivingCall(true)
      setCaller(data.from)
      setName(data.name)
      setCallerSignal(data.signal)
    })
  }, [])

  const callUser = (id: string) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    })

    peer.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      })
    })

    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream
      }
    })

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true)
      peer.signal(signal)
    })

    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    })

    peer.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: caller })
    })

    peer.on('stream', (stream) => {
      if (userVideo.current) {
        userVideo.current.srcObject = stream
      }
    })

    peer.signal(callerSignal)
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)
    connectionRef.current.destroy()
  }

  return (
    <>
      <section className="mx-auto flex h-screen max-w-xl items-center justify-center">
        <div className="space-y-4 text-center">
          {stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: '300px' }}
            />
          )}

          <h1 className="text-4xl font-bold">
            Videochamadas para equipes e clientes
          </h1>
          <p className="text-lg">
            Converse com seus colegas e clientes em tempo real com videochamadas
            e compartilhamento de tela
          </p>

          <form className="flex items-center justify-center gap-4">
            <input
              type="text"
              placeholder="Insira o ID da sala"
              className="h-12 w-1/2 rounded-xl bg-slate-900 p-2 outline-none focus:bg-slate-800/40"
            />

            <button className="h-12 rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80">
              Entrar
            </button>
          </form>
        </div>
      </section>
    </>
  )
}
