'use client'

import Peer from 'simple-peer'

import { ChangeEvent, MouseEvent, useEffect, useRef, useState } from 'react'
import { connect } from 'socket.io-client'
import NanofyIcon from '@/components/icons/nanofy-icon'
import {
  BsCalendar2DateFill,
  BsCameraVideoFill,
  BsGearFill,
  BsFillVolumeUpFill,
  BsGridFill,
  BsFillMicMuteFill,
  BsFillMicFill,
  BsFillTelephoneFill,
  BsPlusSquareFill,
  BsFillChatDotsFill,
  BsBellFill,
  BsPeopleFill,
  BsChevronDown,
  BsFillImageFill,
  BsMicFill,
} from 'react-icons/bs'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { PiRecordFill } from 'react-icons/pi'
import Webcam from 'react-webcam'

import Image from 'next/image'

import ProfilePic from '@/assets/images/eu.jpeg'
import ProfileOne from '@/assets/images/pessoa1.jpg'
import ProfileTwo from '@/assets/images/pessoa2.jpg'

type VideoConferenceProps = {
  params: { callURL: string }
}

const socket = connect('http://192.168.15.40:5000')
export default function Home() {
  const userId = localStorage.getItem('id')

  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  const [me, setMe] = useState(userId || '')
  const [name, setName] = useState('')
  const [caller, setCaller] = useState('')
  const [idToCall, setIdToCall] = useState('')
  const [callEnded, setCallEnded] = useState(false)
  const [callAccepted, setCallAccepted] = useState(false)
  const [callerSignal, setCallerSignal] = useState('')
  const [receivingCall, setReceivingCall] = useState(false)
  const [stream, setStream] = useState<MediaStream | undefined>()

  const myVideo = useRef<HTMLVideoElement>(null)
  const userVideo = useRef<HTMLVideoElement>(null)
  const connectionRef = useRef()

  useEffect(() => {
    socket.on('me', (id) => {
      localStorage.setItem('id', id)

      setMe(id)
    })

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        if (myVideo.current) myVideo.current.srcObject = stream
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


    // @ts-ignore
    connectionRef.current = peer
  }

  const answerCall = () => {
    setCallAccepted(true)
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream
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

    // @ts-ignore
    connectionRef.current = peer
  }

  const leaveCall = () => {
    setCallEnded(true)

    // @ts-ignore
    connectionRef.current.destroy()
  }

  const copyId = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    navigator.clipboard.writeText(me)

    console.log('ID copiado', me)
  }

  return (
    <>
      {callAccepted && !callEnded ? (
        <>
          <section className="flex h-screen flex-col px-24 py-10">
            <div className="grid flex-1 grid-cols-8 gap-6">
              <div className="col-span-1">
                <div className="flex h-full flex-col items-center gap-6">
                  <div className="mb-auto">
                    <NanofyIcon className="h-14 w-14" />
                  </div>

                  <div className="flex h-full flex-col justify-center gap-6">
                    <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4">
                      <BsCalendar2DateFill className="text-2xl text-slate-300" />
                    </button>

                    <button className="rounded-2xl bg-slate-800/40 p-4">
                      <BsCameraVideoFill className="text-2xl text-blue-400" />
                    </button>

                    <button className="rounded-2xl bg-slate-800/40 p-4">
                      <BsGearFill className="text-2xl text-slate-300" />
                    </button>
                  </div>

                  <div className="group relative mt-auto flex flex-col items-center">
                    {showVolume && (
                      <div className="relative -translate-y-4 -rotate-90">
                        <input
                          type="range"
                          className="absolute block h-1 appearance-auto bg-slate-800 [&::-webkit-slider-runnable-track]:bg-black/25"
                        />
                      </div>
                    )}

                    <button
                      onClick={() => setShowVolume(!showVolume)}
                      className=" rounded-2xl bg-slate-800/40 p-4"
                    >
                      <BsFillVolumeUpFill className="text-2xl text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-5">
                <div className="relative flex flex-col">
                  <div className="flex items-center justify-between">
                    <h1 className="text-lg">Daily - Time Nanofy</h1>

                    <div className="flex items-center gap-4 font-light text-slate-400">
                      <span>12.03.2024</span>

                      <span>18:30PM</span>

                      <button className="rounded-2xl bg-slate-800/40 p-4">
                        <BsGridFill className="text-2xl text-blue-600" />
                      </button>
                    </div>
                  </div>
                  <div className="grid flex-1 grid-cols-2 gap-4 py-12">
                    {stream && (
                      <Webcam />
                    )}

                    <video
                      playsInline
                      ref={userVideo}
                      autoPlay
                    />
                  </div>

                  <div className="flex items-center justify-center gap-4 py-12">
                    <button
                      onClick={() => setMuted(!muted)}
                      className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40"
                    >
                      {muted ? (
                        <BsFillMicMuteFill className="text-2xl text-slate-300" />
                      ) : (
                        <BsFillMicFill className="text-2xl text-slate-300" />
                      )}
                    </button>

                    <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40">
                      <BsCameraVideoFill className="text-2xl text-slate-300" />
                    </button>

                    <button onClick={leaveCall} className="justify-self-center rounded-2xl bg-red-500 p-4 hover:bg-red-500/80">
                      <BsFillTelephoneFill className="rotate-[134deg] text-2xl text-white" />
                    </button>

                    <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40">
                      <PiRecordFill className="text-2xl text-slate-300" />
                    </button>

                    <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40">
                      <BsPlusSquareFill className="text-2xl text-slate-300" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex h-full w-full flex-col rounded-3xl bg-slate-900">
                  <div className="flex justify-between border-b border-slate-600 p-6">
                    <button>
                      <BsFillChatDotsFill className="text-2xl text-blue-400" />
                    </button>

                    <div className="flex items-center gap-4">
                      <button className="relative">
                        <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-slate-800 bg-blue-500" />
                        <BsBellFill className="text-2xl" />
                      </button>

                      <Image
                        width={256}
                        height={256}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-800"
                        src={ProfilePic}
                        alt=""
                      />
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <div className="flex items-center justify-between gap-4">
                      <button className="flex items-center gap-8 rounded-xl bg-slate-800 p-4">
                        <BsPeopleFill className="text-2xl text-blue-400" />

                        <BsChevronDown />
                      </button>

                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Image
                            width={256}
                            height={256}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-800"
                            src={ProfileOne}
                            alt=""
                          />

                          <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                        </div>

                        <div className="relative">
                          <Image
                            width={256}
                            height={256}
                            className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500 ring-offset-4 ring-offset-slate-800"
                            src={ProfileTwo}
                            alt=""
                          />

                          <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 rounded-full bg-green-500" />
                        </div>
                      </div>
                    </div>

                    <div className="mt-12 flex flex-1 flex-col">
                      <div className="flex flex-1 flex-col gap-4">
                        <div className="flex items-end gap-2">
                          <Image
                            width={256}
                            height={256}
                            className="h-10 w-10 rounded-full object-cover"
                            src={ProfileOne}
                            alt=""
                          />

                          <div className="rounded-e-2xl rounded-t-2xl bg-slate-800">
                            <p className="p-2">
                              Em 5 minutos, começaremos a reunião 🚀
                            </p>
                          </div>
                        </div>
                        <div className="flex items-end justify-end gap-2">
                          <div className="rounded-s-2xl rounded-t-2xl bg-blue-800">
                            <p className="p-2">Beleza, estarei lá! 🚀</p>
                          </div>
                        </div>

                        <span className="mb-2 mt-auto block pl-2 text-xs">
                          xpto está digitando...
                        </span>
                      </div>
                    </div>
                    <div className="relative rounded-xl bg-slate-800 pb-4">
                      <textarea
                        rows={2}
                        defaultValue={'lorem ipsum dolor sit amet...'}
                        className="w-full resize-none bg-transparent p-2 text-slate-300 outline-none"
                      />
                      <button className="absolute right-2 top-2">
                        <HiOutlineEmojiHappy className="text-2xl text-slate-400" />
                      </button>

                      <div className="absolute bottom-0 left-0 flex w-full items-center gap-2 p-2">
                        <button className="">
                          <BsFillImageFill className="text-slate-600" />
                        </button>
                        <button className="">
                          <BsMicFill className="text-slate-600" />
                        </button>
                        <button className="">😂</button>
                        <button className="">👍</button>
                        <button className="">🚀</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <>
          <section className="mx-auto flex h-screen max-w-xl items-center justify-center">
            <div className="space-y-4 text-center">
              ID de Conexão: {me}

              <h1 className="text-4xl font-bold">
                Videochamadas para equipes e clientes
              </h1>
              <p className="text-lg">
                Converse com seus colegas e clientes em tempo real com
                videochamadas e compartilhamento de tela
              </p>
              <div className="flex items-center justify-center gap-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setName(e.target.value)
                  }
                  placeholder="Nome"
                  className="h-12 rounded-xl bg-slate-900 p-2 outline-none focus:bg-slate-800/40"
                />

                <input
                  type="text"
                  placeholder="Insira o ID da sala"
                  value={idToCall}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setIdToCall(e.target.value)
                  }
                  className="h-12 w-1/2 rounded-xl bg-slate-900 p-2 outline-none focus:bg-slate-800/40"
                />

                <button
                  type="button"
                  onClick={copyId}
                  className="h-12 rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80"
                >
                  Copiar Id
                </button>

                <div className="call-button">
                  {callAccepted && !callEnded ? (
                    <button
                      className="h-12 rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80"
                      onClick={leaveCall}
                    >
                      Finalizar chamada
                    </button>
                  ) : (
                    <button
                      aria-label="call"
                      className="h-12 rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80"
                      onClick={() => callUser(idToCall)}
                    >
                      Ligar
                    </button>
                  )}
                  {idToCall}
                </div>
              </div>
              <div className="mt-12">

                {receivingCall && !callAccepted ? (
                  <div className="caller">
                    <h1>{name} is calling...</h1>
                    <button
                      onClick={answerCall}
                      className="h-12 rounded-xl bg-slate-800 px-4 hover:bg-slate-800/80"
                    >
                      Aceitar
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </>
      )}
    </>
  )
}
