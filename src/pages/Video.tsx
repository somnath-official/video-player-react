import { useEffect, useRef, useState } from "react"
import { IVideo, IVideoPlaySettings } from "../interfaces/Video"
import { toHumanRaedableFormat } from "../utils/time"

const INIT_VIDEO_SETTINGS = {
  muted: false,
  volume: 1,
  loop: false,
  time: 0,
}

export const Video = ({
  video,
  settings = INIT_VIDEO_SETTINGS
}: {
  video: IVideo,
  settings?: IVideoPlaySettings
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)

  const [videoVolume, setVideoVolume] = useState(settings.volume)
  const [isVideoMuted, setIsVideoMuted] = useState(settings.muted)
  const [loopVideo, setLoopVideo] = useState(settings.loop)
  const [isVideoEnded, setVideoEnded] = useState(false)
  const [time, setTime] = useState(settings.time)

  useEffect(() => {
    if (settings.time && videoRef.current) videoRef.current.currentTime = settings.time
  }, [settings.time])

  useEffect(() => {
    if (videoRef.current) videoRef.current!.volume = videoVolume
  }, [videoVolume])

  const play = () => {
    videoRef.current?.play()
    setIsVideoPlaying(true)
    setVideoEnded(false)
  }

  const pause = () => {
    videoRef.current?.pause()
    setIsVideoPlaying(false)
  }

  const replay = () => {
    if (videoRef.current) {
      videoRef.current!.currentTime = 0
      play()
    }
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

  const getPlayPauseIcon = () => {
    if (isVideoEnded) return <i className="fa fa-rotate-forward"></i>

    if (isVideoPlaying) return <i className="fa fa-pause"></i>
    else return <i className="fa fa-play"></i>
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
          else {
            setVideoEnded(true)
            pause()
          }
        }}
        onLoadedMetadata={(e) => {
          const d = Math.floor(e.currentTarget.duration)
          setVideoDuration(d)
        }}
        onTimeUpdate={(e) => {
          const d = Math.floor(e.currentTarget.currentTime)
          setTime(d)
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
        <div
          className="controllers"
          onClick={(e: React.MouseEvent<HTMLInputElement>) => {
            e.stopPropagation()
          }}
        >
          <div className="video-duration-indicator">
            <input
              type="range"
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                e.stopPropagation()
              }}
              value={time}
              min={0}
              max={Math.floor(videoDuration)}
              step={0.1}
              onMouseDown={pause}
              onMouseUp={play}
            />
          </div>

          <div className="action-menus">
            <span
              className="play-pause-controller"
              onClick={() => {
                if (isVideoEnded) replay()
                else if (isVideoPlaying) pause()
                else play()
              }}
            >
              {getPlayPauseIcon()}
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

            <div className="video-time-duration">
              {time ? toHumanRaedableFormat(time) : '0:00'}/{videoDuration ? toHumanRaedableFormat(videoDuration) : '0:00'}
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
