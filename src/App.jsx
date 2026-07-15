import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'
import StorePage from './pages/StorePage'
import NotFound from './pages/NotFound'
import IntroScreen from './components/IntroScreen'

const INTRO_KEY = 'musime_intro_seen'

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
    <BrowserRouter>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/game/:mode" element={<GamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="/store" element={<StorePage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
