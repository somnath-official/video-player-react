import './App.scss'
import { Footer } from './components/Footer'
import { Header } from './components/Header'
import { Container } from './components/UI/Container'
import { Video } from './pages/Video'

function App() {
  return (
    <div>
      <Header />
        <main style={{minHeight: 'calc(100vh - 180px)', overflowY: 'auto'}}>
          <Container>
            <Video />
          </Container>
        </main>
      <Footer />
    </div>
  )
}

export default App
