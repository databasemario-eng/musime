import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const DIFFICULTIES = [
  { label: 'Fácil', time: 20, desc: '20 segundos por carta' },
  { label: 'Normal', time: 15, desc: '15 segundos por carta' },
  { label: 'Difícil', time: 10, desc: '10 segundos por carta' },
]

export default function StartPage() {
  const navigate = useNavigate()
  const [difficulty, setDifficulty] = useState(1)
  const [ranking, setRanking] = useState([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem('musime_ranking')
      if (raw) setRanking(JSON.parse(raw).slice(0, 3))
    } catch { /* empty */ }
  }, [])

  function handlePlay() {
    localStorage.setItem('musime_time', DIFFICULTIES[difficulty].time)
    navigate('/game')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#b7002b] to-black flex flex-col items-center justify-center gap-8 px-4 py-12">
      {/* logo */}
      <div className="text-center">
        <img src="/logo-musime.png" alt="MUSIME" className="w-72 md:w-96 mx-auto mb-6 drop-shadow-2xl" />
        <p className="text-gray-300 text-lg md:text-xl mt-2 font-light tracking-wide">
          ¿Puedes ordenar los openings de anime por año?
        </p>
      </div>

      {/* difficulty */}
      <div className="flex flex-col items-center gap-3">
        <p className="text-gray-400 text-sm uppercase tracking-widest">Dificultad</p>
        <div className="flex gap-3">
          {DIFFICULTIES.map((d, i) => (
            <button
              key={d.label}
              onClick={() => setDifficulty(i)}
              className={`px-5 py-3 rounded-xl font-bold transition-all ${
                difficulty === i
                  ? 'bg-red-600 text-white scale-105 shadow-lg shadow-red-900'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              <span className="block">{d.label}</span>
              <span className="block text-xs font-normal opacity-70">{d.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* play button */}
      <button
        onClick={handlePlay}
        className="px-16 py-5 bg-[#fcbe00] hover:brightness-110 active:scale-95 text-black text-2xl font-bold border-2 border-black rounded-2xl shadow-2xl shadow-black/50 transition-all tracking-wide"
      >
        ¡JUGAR!
      </button>

      {/* ranking top 3 */}
      {ranking.length > 0 && (
        <div className="bg-gray-900/70 border border-gray-700 rounded-2xl px-8 py-5 w-full max-w-xs backdrop-blur">
          <h2 className="text-center text-gray-400 text-xs uppercase tracking-widest mb-3">Top 3</h2>
          {ranking.map((entry, i) => (
            <div key={i} className="flex justify-between items-center py-1 border-b border-gray-800 last:border-0">
              <span className="text-yellow-400 font-bold w-6">{i + 1}.</span>
              <span className="text-white flex-1 truncate">{entry.name}</span>
              <span className="text-red-400 font-black">{entry.score}</span>
            </div>
          ))}
          <button
            onClick={() => navigate('/ranking')}
            className="mt-3 w-full py-2 bg-black text-white border-2 border-white font-bold rounded-xl text-sm hover:bg-gray-900 transition-colors"
          >
            Ver ranking completo →
          </button>
        </div>
      )}

      {ranking.length === 0 && (
        <button
          onClick={() => navigate('/ranking')}
          className="px-8 py-3 bg-black text-white border-2 border-white font-bold rounded-xl hover:bg-gray-900 transition-colors"
        >
          Ver ranking →
        </button>
      )}

      {/* Heardle mode */}
      <button
        onClick={() => navigate('/heardle')}
        className="px-8 py-3 bg-gray-900 text-yellow-300 border-2 border-yellow-600 font-bold rounded-xl hover:bg-gray-800 hover:border-yellow-400 transition-colors text-sm"
      >
        🎵 Modo Heardle
      </button>
    </div>
  )
}
