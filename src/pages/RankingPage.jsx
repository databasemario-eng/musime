import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const MEDALS = ['🥇', '🥈', '🥉']

export default function RankingPage() {
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem('musime_ranking')
      if (raw) setRanking(JSON.parse(raw))
    } catch { /* empty */ }
  }, [])

  function handleClear() {
    if (confirmClear) {
      localStorage.removeItem('musime_ranking')
      setRanking([])
      setConfirmClear(false)
    } else {
      setConfirmClear(true)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b7002b] to-black flex flex-col items-center gap-6 px-4 py-12">
      <h1 className="text-5xl font-black text-white tracking-tight">
        MUS<span className="text-red-400">I</span>ME
      </h1>
      <h2 className="text-2xl font-bold text-gray-300">Ranking</h2>

      <div className="w-full max-w-md bg-gray-900/70 border border-gray-700 rounded-2xl overflow-hidden backdrop-blur">
        {ranking.length === 0 ? (
          <p className="text-center text-gray-500 py-12">Aún no hay puntuaciones guardadas.</p>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="py-3 px-4 text-left text-xs text-gray-500 uppercase tracking-widest">#</th>
                <th className="py-3 px-4 text-left text-xs text-gray-500 uppercase tracking-widest">Nombre</th>
                <th className="py-3 px-4 text-right text-xs text-gray-500 uppercase tracking-widest">Puntos</th>
                <th className="py-3 px-4 text-right text-xs text-gray-500 uppercase tracking-widest">Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((entry, i) => (
                <tr
                  key={i}
                  className={`border-b border-gray-800/50 last:border-0 ${i < 3 ? 'bg-red-950/20' : ''}`}
                >
                  <td className="py-3 px-4 text-lg">
                    {i < 3 ? MEDALS[i] : <span className="text-gray-600 text-sm">{i + 1}</span>}
                  </td>
                  <td className="py-3 px-4 text-white font-semibold truncate max-w-[140px]">{entry.name}</td>
                  <td className="py-3 px-4 text-right text-red-400 font-black text-lg">{entry.score}</td>
                  <td className="py-3 px-4 text-right text-gray-600 text-xs">{entry.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="flex gap-3 flex-wrap justify-center">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors"
        >
          ← Inicio
        </button>
        <button
          onClick={() => navigate('/game')}
          className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
        >
          ¡Jugar!
        </button>
        {ranking.length > 0 && (
          <button
            onClick={handleClear}
            className={`px-6 py-3 font-bold rounded-xl transition-colors ${
              confirmClear
                ? 'bg-red-700 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gray-900 border border-gray-700 hover:border-red-700 text-gray-400'
            }`}
          >
            {confirmClear ? '¿Confirmar borrado?' : 'Borrar ranking'}
          </button>
        )}
      </div>
    </div>
  )
}
