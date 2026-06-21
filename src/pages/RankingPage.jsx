import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function RankingPage() {
  const navigate = useNavigate()
  const [normalRanking, setNormalRanking] = useState([])
  const [yameteRanking, setYameteRanking] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRankings() {
      const { data } = await supabase
        .from('ranking')
        .select('*')
        .order('score', { ascending: false })
        .limit(100)

      if (data) {
        setNormalRanking(data.filter(r => r.mode === 'normal').slice(0, 20))
        setYameteRanking(data.filter(r => r.mode === 'yamete').slice(0, 20))
      }
      setLoading(false)
    }
    fetchRankings()
  }, [])

  return (
    <div
      className="min-h-screen bg-black px-4 py-6"
      style={{
        backgroundImage: 'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white font-['Nunito'] text-sm mb-5 flex items-center gap-1 transition-colors"
        >
          ← Volver al inicio
        </button>

        <h1 className="font-['Bangers'] text-[#fcbe00] text-5xl tracking-widest text-center mb-8">
          RANKING
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center font-['Nunito']">Cargando...</p>
        ) : (
          <div className="flex flex-col gap-10">
            <RankingSection title="MODO NORMAL" data={normalRanking} color="#fcbe00" />
            <RankingSection title="YAMETE KUDASAI" data={yameteRanking} color="#b7002b" />
          </div>
        )}
      </div>
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

function RankingSection({ title, data, color }) {
  return (
    <div>
      <h2
        className="font-['Bangers'] text-2xl tracking-widest text-center mb-4"
        style={{ color }}
      >
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-700 text-center font-['Nunito'] text-sm py-4 border border-gray-800 rounded-xl">
          Sin entradas todavía
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {data.map((entry, i) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 border transition-all ${
                i === 0
                  ? 'bg-yellow-900/20 border-yellow-700/40'
                  : i === 1
                  ? 'bg-gray-700/20 border-gray-600/30'
                  : i === 2
                  ? 'bg-orange-900/20 border-orange-700/30'
                  : 'bg-gray-900/60 border-gray-800/50'
              }`}
            >
              <span className="text-xl w-8 text-center shrink-0">
                {MEDALS[i] ?? <span className="text-gray-600 font-['Nunito'] font-bold text-sm">{i + 1}</span>}
              </span>
              <span className="text-white font-bold font-['Nunito'] flex-1 truncate">{entry.nombre}</span>
              <span className="font-black font-['Bangers'] text-xl" style={{ color }}>{entry.score}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
