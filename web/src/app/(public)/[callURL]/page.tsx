'use client'

import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import {
  BsBellFill,
  BsGridFill,
  BsGearFill,
  BsMicFill,
  BsFillMicFill,
  BsPlusSquareFill,
  BsFillMicMuteFill,
  BsCameraVideoFill,
  BsFillVolumeUpFill,
  BsFillChatDotsFill,
  BsCalendar2DateFill,
  BsPeopleFill,
  BsChevronDown,
  BsFillImageFill,
  BsFillTelephoneFill,
} from 'react-icons/bs'
import { PiRecordFill } from 'react-icons/pi'

import NanofyIcon from '@/components/icons/nanofy-icon'

import ProfilePic from '@/assets/images/eu.jpeg'
import ProfileOne from '@/assets/images/pessoa1.jpg'
import ProfileTwo from '@/assets/images/pessoa2.jpg'
import { HiOutlineEmojiHappy } from 'react-icons/hi'
import { connect } from 'socket.io-client'

import { toast } from 'react-toastify'

type VideoConferenceProps = {
  params: { callURL: string }
}

const socket = connect(process.env.NEXT_PUBLIC_SOCKET_URL as string)

export default function VideoConference({
  params: { callURL },
}: VideoConferenceProps) {
  const [muted, setMuted] = useState(false)
  const [showVolume, setShowVolume] = useState(false)
  // const [stream, setStream] = useState<MediaStream>()

  const myVideo = useRef<HTMLVideoElement>(null)
  const userVideo = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const name = JSON.parse(localStorage.getItem('name') as string)

    if (!name) {
      const promptName = prompt('Qual é o seu nome?')

      localStorage.setItem('name', JSON.stringify(promptName))
    }

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream)
        if (myVideo.current) myVideo.current.srcObject = stream
      })

    socket.on('user-connected', (data) => {
      toast.info(`${data.name} conectou-se!`)
    })

    socket.emit('join-room', {
      name,
      callURL,
    })
  }, [])

  return (
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
            <div className="relative flex h-full flex-col">
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
              <div className="video-grid grid flex-1 grid-cols-3 gap-4 py-12">
                {myVideo && (
                  <video
                    autoPlay
                    playsInline
                    ref={myVideo}
                    className="rounded-2xl"
                  />
                )}

                {userVideo && (
                  <video
                    autoPlay
                    playsInline
                    ref={userVideo}
                    className="rounded-2xl"
                  />
                )}
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

                <button className="justify-self-center rounded-2xl bg-red-500 p-4 hover:bg-red-500/80">
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
  )
}
