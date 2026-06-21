import { BrowserRouter, Routes, Route } from 'react-router-dom'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <div className="bg-black min-h-screen">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/game/:mode" element={<GamePage />} />
          <Route path="/ranking" element={<RankingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
