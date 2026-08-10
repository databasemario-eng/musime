import { useState } from 'react'
import { BrowserRouter, HashRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'
import StorePage from './pages/StorePage'
import NotFound from './pages/NotFound'
import IntroScreen from './components/IntroScreen'

const INTRO_KEY = 'musime_intro_seen'

// En Vercel la web vive en la raíz del dominio y BrowserRouter da URLs limpias
// (musimethegame.com/ranking). En itch.io el juego se sirve desde una subcarpeta
// que cambia en cada subida (/html/12345/...), así que BrowserRouter no reconoce
// ninguna ruta. HashRouter (musimethegame.com/#/ranking) funciona sin importar
// desde qué subcarpeta se sirva la app, así que lo usamos ahí. Se detecta con el
// mismo BASE_URL que ya controla las rutas de los assets (ver vite.config.js).
const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter

export default function App() {
  const [showIntro, setShowIntro] = useState(
    () => !sessionStorage.getItem(INTRO_KEY)
  )

  function handleIntroComplete() {
    sessionStorage.setItem(INTRO_KEY, '1')
    setShowIntro(false)
  }

  if (showIntro) {
    return <IntroScreen onComplete={handleIntroComplete} />
  }

  return (
    <Router>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/game/:mode" element={<GamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  )
}
