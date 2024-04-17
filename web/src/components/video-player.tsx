import { useEffect, useRef } from 'react'

export default function VideoPlayer({ stream }: { stream?: MediaStream }) {
  const videoRef = useRef<HTMLVideoElement>(null)

  console.log(stream)

  useEffect(() => {
    if (videoRef.current && stream) {
      console.log(stream.getAudioTracks())

      videoRef.current.srcObject = stream
    }
  }, [stream])

  return (
    <video
      autoPlay
      ref={videoRef}
      data-testid="peer-video"
      className="h-full w-full rounded-md"
    />
  )
}
