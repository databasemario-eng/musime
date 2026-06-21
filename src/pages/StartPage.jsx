import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
        backgroundImage: 'radial-gradient(circle, #2a2a2a 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {/* Logo */}
      <div className="mb-3">
        <img
          src="/logo-musime.png"
          alt="MUSIME"
          className="w-80 md:w-[420px] mx-auto drop-shadow-[0_0_30px_#b7002b]"
        />
      </div>

      <p className="font-['Nunito'] text-gray-300 text-center text-base mb-8 max-w-xs leading-relaxed">
        ¿Puedes ordenar los openings de anime por año?
      </p>

      {/* Mode buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs mb-10">
        <button
          onClick={() => navigate('/game/normal')}
          className="bg-[#fcbe00] text-black rounded-2xl py-4 px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="font-['Bangers'] text-3xl tracking-widest block">MODO NORMAL</span>
          <span className="font-['Nunito'] font-bold text-sm block mt-0.5">
            2 vidas · 2 intentos por carta · 10 seg
          </span>
        </button>

        <button
          onClick={() => navigate('/game/yamete')}
          className="bg-[#b7002b] text-white rounded-2xl py-4 px-6 shadow-lg hover:scale-105 active:scale-95 transition-transform"
        >
          <span className="font-['Bangers'] text-3xl tracking-widest block">YAMETE KUDASAI</span>
          <span className="font-['Nunito'] font-bold text-sm block mt-0.5 text-red-200">
            Sin pistas. Sin piedad.
          </span>
        </button>
      </div>

      {/* Top 3 */}
      {top3.length > 0 && (
        <div className="w-full max-w-xs mb-6">
          <h3 className="font-['Bangers'] text-[#fcbe00] text-xl tracking-widest text-center mb-3">
            🏆 TOP 3
          </h3>
          <div className="flex flex-col gap-2">
            {top3.map((entry, i) => (
              <div
                key={entry.id}
                className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 rounded-xl px-4 py-2.5"
              >
                <span className="text-lg w-6 text-center">{['🥇', '🥈', '🥉'][i]}</span>
                <span className="text-white font-bold font-['Nunito'] flex-1 truncate">{entry.nombre}</span>
                <span className="text-[#fcbe00] font-black font-['Bangers'] text-lg">{entry.score}</span>
                <span className="text-gray-600 text-xs uppercase font-['Nunito']">{entry.mode}</span>
              </div>
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
