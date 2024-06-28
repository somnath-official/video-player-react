import { Card } from "../components/UI"
import { useEffect, useRef, useState } from "react"
import { IVideo } from "../interfaces/Video"

export const Video = ({ video }: { video: IVideo }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoVolume, setVideoVolume] = useState(1)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [loopVideo, setLoopVideo] = useState(false)

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    if (videoRef.current) {
      // Set video initial volume
      setVideoVolume(videoRef.current.volume)
    }
  }

  const play = () => {
    videoRef.current?.play()
    setIsVideoPlaying(true)
  }

  const pause = () => {
    videoRef.current?.pause()
    setIsVideoPlaying(false)
  }

  const muteVideo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    videoRef.current!.muted = true
    setIsVideoMuted(true)
  }

  const unMmuteVideo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    videoRef.current!.muted = false
    setIsVideoMuted(false)
  }

  const getVolumeIcon = () => {
    if (isVideoMuted) return <i className="fa fa-volume fa-solid fa-volume-xmark" onClick={unMmuteVideo}></i>
    switch (videoVolume) {
      case 1:
        return <i className="fa fa-volume fa-solid fa-volume-high" onClick={muteVideo}></i>
      default:
        return ''
    }
  }

  return (
    <Card>
      <div className="video-player-container">
        <video
          ref={videoRef}
          className="video-player"
          onEnded={() => {
            if (loopVideo) play()
            else pause()
          }}
        >
          <source src={video.url} type={video.type}></source>
        </video>

        <div
          className="video-controller"
          onClick={() => {
            if (!isVideoPlaying) play()
            else pause()
          }}
        >
          <div className="backdrop"></div>
          <div className="controllers">
            <span className="play-pause-controller">
              {
                !isVideoPlaying
                  ? <i className="fa fa-play" onClick={play}></i>
                  : <i className="fa fa-pause" onClick={pause}></i>
              }
            </span>

            <span className="volume-controller">
              { getVolumeIcon() }
            </span>
          </div>
        </div>
        
      </div>
    </Card>
  )
}
