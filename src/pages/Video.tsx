import { useEffect, useRef, useState } from "react"
import { IVideo } from "../interfaces/Video"
import { toHumanRaedableFormat } from "../utils/time"

export const Video = ({
  video,
  muted = false,
  volume = 1,
  loop = false,
  playbackTime = 0,
  isThumbnailVideo = false,
}: {
  video: IVideo
  muted?: boolean
  volume?: number
  loop?: boolean
  playbackTime?: number
  isThumbnailVideo?: boolean
}) => {
  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const videoDurationRef = useRef<HTMLInputElement | null>(null)
  const volumeRef = useRef<HTMLInputElement | null>(null)
  const videoPlayerContainerRef = useRef<HTMLDivElement | null>(null)

  // Local variables
  const [videoVolume, setVideoVolume] = useState(1)
  const [videoLastVolume, setVideoLastVolume] = useState(1)
  const [isVideoMuted, setIsVideoMuted] = useState(false)
  const [loopVideo, setLoopVideo] = useState(false)
  const [time, setTime] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isVideoEnded, setVideoEnded] = useState(false)
  const [isVideoLoading, setVideoLoading] = useState(false)
  const [videoFullScreenStatus, setVideoFullScreenStatus] = useState(false)
  const [videoBufferInfo, setVideoBufferInfo] = useState<{ left: string, width: string }[]>([])

  // Initialize parameters
  useEffect(() => {
    if (!videoRef.current) return

    const setInitialVideoVolume = () => {
      if (muted || volume <= 0) {
        setVideoVolume(0)
        setVideoLastVolume(0)
      }
      else if (volume > 1) {
        setVideoVolume(1)
        setVideoLastVolume(1)
      }
      else {
        setVideoVolume(volume)
        setVideoLastVolume(volume)
      }
    }

    const setInitialVideoPlaybackTime = () => {
      if (playbackTime && videoDuration) {
        if (playbackTime > videoDuration) {
          videoRef.current!.currentTime = videoDuration
          setTime(videoDuration)
        } else {
          videoRef.current!.currentTime = playbackTime
          setTime(playbackTime)
        }
      }
    }

    const setInitialLoopStatus = () => {
      videoRef.current!.loop = loop
    }

    setInitialVideoVolume()  
    setInitialVideoPlaybackTime()  
    setInitialLoopStatus()
  }, [loop, muted, playbackTime, videoDuration, volume])

  useEffect(() => {
    if (!videoRef.current || !volumeRef.current) return
    
    videoRef.current.volume = videoVolume

    const max = +volumeRef.current.max
    const size = (videoVolume * 100) / max;
    if (size >= 0) volumeRef.current.style.setProperty('--volume-range-size', `${size}%`)
  }, [videoVolume])

  useEffect(() => {
    if (!videoDurationRef.current) return

    const max = +videoDurationRef.current.max
    const size = (time * 100) / max;
    if (size >= 0) videoDurationRef.current.style.setProperty('--video-duration-bg-size', `${size}%`)
  }, [time])

  useEffect(() => {
    let t: number | null = null

    if (!videoPlayerContainerRef.current) return
    
    videoPlayerContainerRef.current.onfullscreenchange = (() => {
      setVideoFullScreenStatus(prev => !prev)
    })

    if (isThumbnailVideo) videoPlayerContainerRef.current.classList.add('thumbnail')

    videoPlayerContainerRef.current.onmousemove = (() => {
      if (!isThumbnailVideo && !isVideoLoading) {
        videoPlayerContainerRef.current?.classList.add('hover')
        if (t != null) clearTimeout(t)

        t = setTimeout(() => {
          videoPlayerContainerRef.current?.classList.remove('hover')
        }, 1000)
      }
    })

    return () => {
      if (t != null) clearTimeout(t)
    }
  }, [isThumbnailVideo, isVideoLoading])

  const play = () => {
    if (!isThumbnailVideo) {
      videoRef.current?.play()
      setIsVideoPlaying(true)
      setVideoEnded(false)
    }
  }

  const pause = () => {
    videoRef.current?.pause()
    setIsVideoPlaying(false)
  }

  const replay = () => {
    if (videoRef.current) {
      if (videoDurationRef.current) {
        videoDurationRef.current.style.setProperty('--video-duration-bg-size', `0%`)
      }
      videoRef.current!.currentTime = 0
      play()
    }
  }

  const muteVideo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    videoRef.current!.muted = true
    setIsVideoMuted(true)
    setVideoVolume(0)
  }

  const unMmuteVideo = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    videoRef.current!.muted = false
    setIsVideoMuted(false)
    if (videoLastVolume) setVideoVolume(videoLastVolume)
    else setVideoVolume(1)
  }

  const updateVolume = (e: React.MouseEvent<HTMLInputElement>) => {
    if (Number(e.currentTarget.value)) {
      videoRef.current!.muted = false
      setIsVideoMuted(false)
    }
    setVideoLastVolume(Number(e.currentTarget.value))
    setVideoVolume(Number(e.currentTarget.value))
  }

  const enterFullScreen = () => {
    if (videoPlayerContainerRef.current) videoPlayerContainerRef.current.requestFullscreen()
  }

  const exitFullScreen = () => {
    if (videoPlayerContainerRef.current) document.exitFullscreen()
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

  const trackBufferInfo = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    if (videoDurationRef.current) {
      const max = Number(videoDurationRef.current.max)
      const min = Number(videoDurationRef.current.min)
      const t: { left: string, width: string }[] = []

      const buffered = e.currentTarget.buffered
      for (let i = 0; i < buffered.length; i++) {
        const start = buffered.start(i)
        const end = buffered.end(i)
        const left = ((start - min) / max) * 100
        const width = ((end - start) / max) * 100
        
        t.push({ left: `${left}%`, width: `${width}%` })
        console.log({i, start, end})
      }

      setVideoBufferInfo(t)
    }
  }

  return (
    <div
      className="video-player-container"
      ref={videoPlayerContainerRef}
    >
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
          if (loopVideo) replay()
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
          setTime(Math.floor(e.currentTarget.currentTime))
          trackBufferInfo(e)
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
        <div className="video-title" onClick={(e) => e.stopPropagation()}>{video.title}</div>
        <div className="controllers" onClick={(e) => e.stopPropagation()}>
          <div className="video-duration-indicator">
            <input
              ref={videoDurationRef}
              type="range"
              onClick={(e) => e.stopPropagation()}
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

            {
              videoBufferInfo.length
                ? <>
                  {
                    videoBufferInfo.map((buffer, index) => {
                      return (
                        <div
                          className="buffer-indicator"
                          key={index}
                          style={{
                            '--left': buffer.left,
                            '--width': buffer.width,
                          } as React.CSSProperties}
                        />
                      )
                    })
                  }
                </>
                : <></>
            }
          </div>

          <div className="action-menus">
            <div className="left">
              {/* Play Pause */}
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

              {/* Volume Control */}
              <span
                className="volume-controller"
                onClick={(e: React.MouseEvent<HTMLSpanElement>) => e.stopPropagation()}
              >
                {getVolumeIcon()}
                <input
                  ref={volumeRef}
                  type="range"
                  onClick={(e: React.MouseEvent<HTMLInputElement>) => {
                    e.stopPropagation()
                  }}
                  value={videoVolume}
                  min={0}
                  max={1}
                  step={0.01}
                  onInput={updateVolume}
                />
              </span>

              {/* Vide Play Time */}
              <div className="video-time-duration">
                <span>{time ? toHumanRaedableFormat(time) : '0:00'}</span> / <span>{videoDuration ? toHumanRaedableFormat(videoDuration) : '0:00'}</span>
              </div>
            </div>
            <div className="right">
              <i
                className="fa fa-arrows-repeat"
                onClick={() => setLoopVideo(prev => !prev)}
                style={loopVideo ? { color: '#12f952' } : {}}
              ></i>
              <i className="fa fa-cog"></i>
              {
                videoFullScreenStatus
                  ? <i className="fa fa-arrow-down-left-and-arrow-up-right-to-center" onClick={exitFullScreen}></i>
                  : <i className="fa fa-arrow-up-right-and-arrow-down-left-from-center" onClick={enterFullScreen}></i>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
