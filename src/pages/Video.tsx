import { useEffect, useRef, useState } from "react"
import { IVideo, IVideoPlaySettings } from "../interfaces/Video"

const INIT_VIDEO_SETTINGS = {
  muted: false,
  volume: 1,
  loop: true
}

export const Video = ({ video, settings = INIT_VIDEO_SETTINGS }: { video: IVideo, settings?: IVideoPlaySettings }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  
  const [videoVolume, setVideoVolume] = useState(settings.volume)
  const [isVideoMuted, setIsVideoMuted] = useState(settings.muted)
  const [loopVideo, setLoopVideo] = useState(settings.loop)

  useEffect(() => {
    if (videoRef.current) videoRef.current!.volume = videoVolume
  }, [videoVolume])

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

  const updateVolume = (e: React.MouseEvent<HTMLInputElement>) => {
    setVideoVolume(Number(e.currentTarget.value))
  }

  const getVolumeIcon = () => {
    if (isVideoMuted) return <i className="fa-duotone fa-volume-slash" onClick={unMmuteVideo}></i>
    
    if (videoVolume === 0) return <i className="fa-duotone fa-volume-slash" onClick={unMmuteVideo}></i>
    else if (videoVolume > 0 && videoVolume <= 0.4) return <i className="fa-duotone fa-volume-low" onClick={muteVideo}></i>
    else if (videoVolume > 0.4 && videoVolume <= 0.8) return <i className="fa-duotone fa-volume-medium" onClick={muteVideo}></i>
    else if (videoVolume > 0.8) return <i className="fa-duotone fa-volume-high" onClick={muteVideo}></i>
  }

  return (
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

          <span className="volume-controller" onClick={(e: React.MouseEvent<HTMLSpanElement>) => e.stopPropagation()}>
            {getVolumeIcon()}
            <input
              type="range"
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                e.stopPropagation()
              }}
              min={0}
              max={1}
              step={0.01}
              onInput={updateVolume}
            />
          </span>
        </div>
      </div>

    </div>
  )
}
