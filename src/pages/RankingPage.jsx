import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

function formatDate(fecha) {
  if (!fecha) return ''
  return new Date(fecha).toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

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
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      <div className="max-w-lg mx-auto">
        <button
          onClick={() => navigate('/')}
          className="text-gray-500 hover:text-white font-['Nunito'] text-sm mb-6 flex items-center gap-1 transition-colors"
        >
          ← Volver al inicio
        </button>

        <h1
          className="font-['Bangers'] text-6xl tracking-widest text-center mb-10"
          style={{ color: '#fcbe00', textShadow: '0 0 20px #fcbe0050' }}
        >
          RANKING
        </h1>

        {loading ? (
          <p className="text-gray-500 text-center font-['Nunito'] animate-pulse">Cargando...</p>
        ) : (
          <div className="flex flex-col gap-12">
            <RankingSection title="MODO NORMAL" data={normalRanking} color="#fcbe00" />

            {/* Divisor */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#b7002b] to-transparent" />
              <span className="text-[#b7002b] font-['Bangers'] text-sm tracking-widest">☠</span>
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#b7002b] to-transparent" />
            </div>

            <RankingSection title="YAMETE KUDASAI" data={yameteRanking} color="#b7002b" />
          </div>
        )}
      </div>
    </div>
  )
}

const MEDALS = ['🥇', '🥈', '🥉']

const rowVariants = {
  hidden: { opacity: 0, x: -24 },
  show:   { opacity: 1, x: 0 },
}

function RankingSection({ title, data, color }) {
  return (
    <div>
      <h2
        className="font-['Bangers'] text-3xl tracking-widest text-center mb-5"
        style={{ color, textShadow: `0 0 16px ${color}50` }}
      >
        {title}
      </h2>

      {data.length === 0 ? (
        <p className="text-gray-700 text-center font-['Nunito'] text-sm py-6 border border-gray-800 rounded-2xl">
          Sin entradas todavía
        </p>
      ) : (
        <motion.div
          className="flex flex-col gap-2"
          variants={{ show: { transition: { staggerChildren: 0.05 } } }}
          initial="hidden"
          animate="show"
        >
          {data.map((entry, i) => (
            <motion.div
              key={entry.id}
              variants={rowVariants}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 border ${
                i === 0
                  ? 'bg-yellow-900/20 border-yellow-600/40'
                  : i === 1
                  ? 'bg-gray-700/20 border-gray-500/30'
                  : i === 2
                  ? 'bg-orange-900/15 border-orange-700/30'
                  : 'bg-gray-900/50 border-gray-800/50'
              }`}
            >
              <span className="text-xl w-8 text-center shrink-0 leading-none">
                {i < 3 ? MEDALS[i] : <span className="text-gray-600 font-['Nunito'] font-bold text-sm">{i + 1}</span>}
              </span>
              <span className="text-white font-bold font-['Nunito'] flex-1 truncate">{entry.nombre}</span>
              <div className="text-right shrink-0">
                <span className="font-black font-['Bangers'] text-xl block leading-none" style={{ color }}>
                  {entry.score}
                </span>
                <span className="text-gray-600 text-[10px] font-['Nunito']">{formatDate(entry.fecha)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
