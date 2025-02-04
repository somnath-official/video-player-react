import './App.scss'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Video } from './pages/Video'
import { IVideo } from './interfaces/Video'

function App() {
  const videoInfo: IVideo = {
    id: 'new-video-1',
    url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    type: 'video/mp4',
    totalPlayTime: '',
    title: 'My mountain journey | Sikkim tour 2024',
    uploadDate: ''
  }

  return (
    <div>
      <Header />
        <main className='app'>
          <Video video={videoInfo} />
        </main>
      <Footer />
    </div>
  )
}

export default App
