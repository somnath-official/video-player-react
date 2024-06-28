import './App.scss'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Container } from './components/UI/Container'
import { Video } from './pages/Video'
import videoUrl from './assets/video/Video3.mp4'
import { IVideo } from './interfaces/Video'

function App() {
  const videoInfo: IVideo = {
    id: 'new-video-1',
    url: videoUrl,
    type: 'video/mp4',
    totalPlayTime: '',
    title: 'My mountain journey | Sikkim tour 2024',
    uploadDate: ''
  }

  return (
    <div>
      <Header />
        <main className='app'>
          <Container>
            <Video video={videoInfo} />
          </Container>
        </main>
      <Footer />
    </div>
  )
}

export default App
