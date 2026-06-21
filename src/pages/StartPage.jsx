import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { supabase } from '../lib/supabase'

export default function StartPage() {
  const navigate = useNavigate()
  const [top3, setTop3] = useState([])

  useEffect(() => {
    supabase
      .from('ranking')
      .select('*')
      .order('score', { ascending: false })
      .limit(3)
      .then(({ data }) => setTop3(data || []))
  }, [])

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Logo con pulse */}
      <motion.img
        src="/logo-musime.png"
        alt="MUSIME"
        className="w-80 md:w-[420px] mx-auto mb-2"
        animate={{
          filter: [
            'drop-shadow(0 0 18px #b7002b)',
            'drop-shadow(0 0 38px #b7002b) drop-shadow(0 0 60px #b7002b60)',
            'drop-shadow(0 0 18px #b7002b)',
          ],
        }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Título texto */}
      <h1
        className="font-['Bangers'] text-5xl md:text-6xl text-white tracking-widest mb-1"
        style={{ textShadow: '0 0 20px #b7002b, 0 2px 8px #b7002b80' }}
      >
        MUSIME
      </h1>

      {/* Frase japonesa */}
      <div className="text-center mb-2">
        <p className="text-[#fcbe00] text-lg font-['Nunito'] tracking-widest">アニメ音楽クイズ</p>
        <p className="text-gray-500 text-xs font-['Nunito']">(Quiz Musical de Anime)</p>
      </div>

      <p className="font-['Nunito'] text-gray-400 text-center text-sm mb-8 max-w-xs leading-relaxed">
        ¿Puedes ordenar los openings de anime por año?
      </p>

      {/* Botones de modo */}
      <div className="flex flex-col gap-4 w-full max-w-xs mb-10">
        <motion.button
          onClick={() => navigate('/game/normal')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#fcbe00] text-black rounded-2xl py-5 px-6 shadow-lg shadow-[#fcbe00]/20"
        >
          <span className="font-['Bangers'] text-4xl tracking-widest block">MODO NORMAL</span>
          <span className="font-['Nunito'] font-bold text-sm block mt-1 text-black/70">
            2 vidas · 2 intentos por carta · 10 seg
          </span>
        </motion.button>

        <motion.button
          onClick={() => navigate('/game/yamete')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#b7002b] text-white rounded-2xl py-5 px-6 shadow-lg shadow-[#b7002b]/30"
        >
          <span className="font-['Bangers'] text-4xl tracking-widest block">YAMETE KUDASAI</span>
          <span className="font-['Nunito'] font-bold text-sm block mt-1 text-red-200">
            Sin pistas. Sin piedad.
          </span>
        </motion.button>
      </div>

      {/* Top 3 */}
      {top3.length > 0 && (
        <div className="w-full max-w-xs mb-6">
          <h3 className="font-['Bangers'] text-[#fcbe00] text-2xl tracking-widest text-center mb-3">
            🏆 TOP 3
          </h3>
          <div className="flex flex-col gap-2">
            {top3.map((entry, i) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-3"
              >
                <span className="text-xl w-6 text-center">{['🥇', '🥈', '🥉'][i]}</span>
                <span className="text-white font-bold font-['Nunito'] flex-1 truncate">{entry.nombre}</span>
                <span className="text-[#fcbe00] font-black font-['Bangers'] text-xl">{entry.score}</span>
                <span className="text-gray-600 text-xs uppercase font-['Nunito']">{entry.mode}</span>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => navigate('/ranking')}
        className="text-gray-500 text-sm font-['Nunito'] hover:text-white transition-colors underline underline-offset-2"
      >
        VER RANKING COMPLETO
      </button>
    </div>
  )
}
