export interface IVideo {
    id: string
    url: string
    type: string
    totalPlayTime: string
    title: string
    uploadDate: string
}

export interface IVideoPlaySettings {
    muted: boolean
    volume: number
    loop: boolean
}