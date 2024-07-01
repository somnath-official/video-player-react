import { useEffect, useRef, useState } from "react"
import { IVideo } from "../interfaces/Video"
import { toHumanRaedableFormat } from "../utils/time"

export const Video = ({
  video,
  muted = false,
  volume = 1,
  loop = false,
  playbackTime = 0,
}: {
  video: IVideo,
  muted?: boolean,
  volume?: number,
  loop?: boolean,
  playbackTime?: number,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoDurationRef = useRef<HTMLInputElement | null>(null)
  const volumeRef = useRef<HTMLInputElement | null>(null)

  const [videoVolume, setVideoVolume] = useState(volume)
  const [isVideoMuted, setIsVideoMuted] = useState(muted)
  const [loopVideo, setLoopVideo] = useState(loop)
  const [time, setTime] = useState(playbackTime)

  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isVideoEnded, setVideoEnded] = useState(false)
  const [isVideoLoading, setVideoLoading] = useState(false)

  useEffect(() => {
    if (playbackTime && videoRef.current) videoRef.current.currentTime = playbackTime
  }, [playbackTime])

  useEffect(() => {
    if (videoRef.current) videoRef.current!.volume = videoVolume

    if (volumeRef.current) {
      const min = +volumeRef.current.min
      const max = +volumeRef.current.max
      const size = (videoVolume - min) / (max - min) * 100;
      if (size) {
        volumeRef.current.style.setProperty('--volume-range-size', `${size}%`)
      }
    }
  }, [videoVolume])

  useEffect(() => {
    if (videoDurationRef.current) {
      const min = +videoDurationRef.current.min
      const max = +videoDurationRef.current.max
      const size = (time - min) / (max - min) * 100;
      if (size) {
        videoDurationRef.current.style.setProperty('--video-duration-bg-size', `${size}%`)
      }
    }
  }, [time])

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
      if (videoDurationRef.current) {
        videoDurationRef.current.style.setProperty('--video-duration-bg-size', `0%`)
      }
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
      {
        isVideoLoading &&
        <div className="loading">
          <div className="loader"></div>
        </div>
      }

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
        onLoadStart={() => setVideoLoading(true)}
        onLoadedData={() => setVideoLoading(false)}
      >
        <source src={video.url} type={video.type}></source>
      </video>

      <div
        className="video-controller"
        onClick={() => {
          if (isVideoEnded) replay()
          else if (!isVideoPlaying) play()
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
              ref={videoDurationRef}
              type="range"
              onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                e.stopPropagation()
              }}
              value={time}
              min={0}
              max={Math.floor(videoDuration)}
              step={0.1}
              onInput={(e: React.MouseEvent<HTMLInputElement>) => {
                const time = Math.floor(Number(e.currentTarget.value))
                videoRef.current!.currentTime = time
                setTime(time)
              }}
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
                ref={volumeRef}
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
