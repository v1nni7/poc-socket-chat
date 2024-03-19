'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { MdScreenShare } from 'react-icons/md'
import {
  BsBellFill,
  BsGridFill,
  BsGearFill,
  BsMicFill,
  BsFillMicFill,
  BsPlusSquareFill,
  BsCameraVideoFill,
  BsFillChatDotsFill,
  BsCalendar2DateFill,
  BsPeopleFill,
  BsChevronDown,
  BsFillImageFill,
  BsFillTelephoneFill,
  BsFillVolumeUpFill,
} from 'react-icons/bs'

import { ws } from '@/utils/ws'
import ProfilePic from '@/assets/images/eu.jpeg'
import ProfileOne from '@/assets/images/pessoa1.jpg'
import ProfileTwo from '@/assets/images/pessoa2.jpg'
import { useRoom } from '@/context/room-context'
import { useUser } from '@/context/user-context'
import { useChat } from '@/context/chat-context'
import { PeerState } from '@/reducers/peer-reducer'
import VideoPlayer from '@/components/video-player'
import NameInput from '@/components/name-input'
import NanofyIcon from '@/components/icons/nanofy-icon'

import { PiRecordFill } from 'react-icons/pi'
import { HiOutlineEmojiHappy } from 'react-icons/hi'

import RoomChat from '@/components/room-chat'

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
    shareScreen,
    screenStream,
    screenSharingId,
    handleUserJoined,
  } = useRoom()

  const [cameraOn, setCameraOn] = useState<boolean>(true)

  const { userName, userId } = useUser()

  useEffect(() => {
    if (stream) {
      ws.emit('join-room', { roomId, peerId: userId, userName })
    }
  }, [roomId, userId, stream, userName])

  useEffect(() => {
    setRoomId(roomId || '')
  }, [roomId, setRoomId])

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [screenSharingId]: sharing, ...peersToShow } = peers

  useEffect(() => {
    try {
      navigator.mediaDevices
        .getUserMedia({ video: cameraOn, audio: true })
        .then((stream) => {
          setStream(stream)
        })
    } catch (error) {
      console.log(error)
    }
  }, [cameraOn])

  useEffect(() => {
    handleUserJoined()
  }, [handleUserJoined])

  return (
    <>
      <section className="h-screen px-24 py-10">
        <div className="grid h-full grid-cols-12 grid-rows-12 gap-4">
          <div className="col-span-9 row-span-12">
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
              <div className="grid flex-1 grid-cols-3 gap-4 py-12">
                {screenSharingVideo && screenSharingId && (
                  <div className="col-span-3 pr-4">
                    <VideoPlayer stream={screenSharingVideo} />
                  </div>
                )}

                {screenSharingId !== userId && (
                  <div className="flex flex-col">
                    <div className="relative overflow-hidden rounded-xl">
                      <VideoPlayer stream={stream} />
                      <div className="absolute left-0 top-0 flex h-full w-full items-end">
                        <span className="w-full p-2">{userName}</span>
                      </div>
                    </div>
                  </div>
                )}

                {Object.values(peersToShow as PeerState)
                  .filter((peer) => !!peer.stream)
                  .map((peer) => {
                    return (
                      <div
                        key={peer.peerId + new Date().getTime()}
                        className="flex flex-col"
                      >
                        <div className="relative overflow-hidden rounded-xl">
                          {peer.stream ? (
                            <VideoPlayer stream={peer.stream} />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-900">
                              Camera desligada
                            </div>
                          )}
                          <div className="absolute left-0 top-0 flex h-full w-full items-end">
                            <span className="w-full p-2">{peer.userName}</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              <div className="flex items-center justify-center gap-4 pt-12">
                <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40">
                  <BsFillMicFill className="text-2xl text-slate-300" />
                </button>

                <button
                  onClick={() => setCameraOn(!cameraOn)}
                  className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40"
                >
                  <BsCameraVideoFill className="text-2xl text-slate-300" />
                </button>

                <button
                  onClick={() => ws.emit('leave-room', { userId, roomId })}
                  className="justify-self-center rounded-2xl bg-red-500 p-4 hover:bg-red-500/80"
                >
                  <BsFillTelephoneFill className="rotate-[134deg] text-2xl text-white" />
                </button>

                <button className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40">
                  <PiRecordFill className="text-2xl text-slate-300" />
                </button>

                <button
                  onClick={shareScreen}
                  className="justify-self-center rounded-2xl bg-slate-800/40 p-4 hover:bg-slate-700/40"
                >
                  <BsPlusSquareFill className="text-2xl text-slate-300" />
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-3 row-span-12">
            <div className="flex h-full flex-col rounded-2xl bg-slate-900 p-4">
              <RoomChat />
            </div>
          </div>
        </div>
      </section>

      {/* <div className="flex min-h-screen flex-col">
        <div className="flex grow">
          {screenSharingVideo && (
            <div className="w-4/5 pr-4">
              <VideoPlayer stream={screenSharingVideo} />
            </div>
          )}

          <div
            className={`grid gap-4 ${screenSharingVideo ? 'w-1/5 grid-cols-1' : 'grid-cols-4'}`}
          >
            {screenSharingId !== userId && (
              <div>
                <VideoPlayer stream={stream} />
                <NameInput />
              </div>
            )}

            {Object.values(peersToShow as PeerState)
              .filter((peer) => !!peer.stream)
              .map((peer) => (
                <div key={peer.peerId}>
                  <VideoPlayer stream={peer.stream} />
                  <div>{peer.userName}</div>
                </div>
              ))}
          </div>

          {chat.isChatOpen && (
            <div className="border-l-2 pb-28">
              <Chat />
            </div>
          )}
        </div>

        <div className="fixed bottom-0 flex h-28 w-full items-center justify-center border-t-2 bg-white p-6">
          <button onClick={shareScreen}>
            <MdScreenShare />
          </button>
          <button onClick={toggleChat}>
            <BsChatSquareTextFill />
          </button>
        </div>
      </div> */}
    </>
  )
}
