import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import StartPage from './pages/StartPage'
import GamePage from './pages/GamePage'
import RankingPage from './pages/RankingPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/game" element={<GamePage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
    </BrowserRouter>
  )
}
