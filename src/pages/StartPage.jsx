import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase'
import { PACKS } from '../data/packs'

const DLC_PACKS = Object.values(PACKS).filter(p => p.id !== 'base')

export default function StartPage() {
  const navigate = useNavigate()
  const [top3, setTop3] = useState([])
  const [selectedPacks, setSelectedPacks] = useState(['base'])
  const [showPackMenu, setShowPackMenu] = useState(false)

  useEffect(() => {
    supabase
      .from('ranking')
      .select('*')
      .order('score', { ascending: false })
      .limit(3)
      .then(({ data }) => setTop3(data || []))
  }, [])

  function togglePack(packId) {
    setSelectedPacks(prev => {
      if (packId === 'base') {
        // Base always stays; toggle between base-only and base+all
        return prev.length === 1 ? prev : ['base']
      }
      if (prev.includes(packId)) {
        const next = prev.filter(id => id !== packId)
        return next.length === 0 ? ['base'] : next
      }
      return [...prev.filter(id => id !== 'base'), 'base', packId]
    })
  }

  function selectOnlyPack(packId) {
    setSelectedPacks([packId])
  }

  function startGame(mode) {
    const packsParam = selectedPacks.join(',')
    navigate(`/game/${mode}?packs=${packsParam}`)
  }

  const packLabel = selectedPacks.length === 1 && selectedPacks[0] === 'base'
    ? 'Juego base'
    : selectedPacks.includes('base')
      ? `Base + ${selectedPacks.filter(p => p !== 'base').map(p => PACKS[p]?.name).join(', ')}`
      : selectedPacks.map(p => PACKS[p]?.name).join(' + ')

  return (
    <div
      className="min-h-screen bg-black flex flex-col items-center justify-center px-4 py-10"
      style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
      }}
    >
      {/* Logo */}
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

      <h1
        className="font-['Bangers'] text-5xl md:text-6xl text-white tracking-widest mb-1"
        style={{ textShadow: '0 0 20px #b7002b, 0 2px 8px #b7002b80' }}
      >
        MUSIME
      </h1>

      <div className="text-center mb-2">
        <p className="text-[#fcbe00] text-lg font-['Nunito'] tracking-widest">アニメ音楽クイズ</p>
        <p className="text-gray-500 text-xs font-['Nunito']">(Quiz Musical de Anime)</p>
      </div>

      <p className="font-['Nunito'] text-gray-400 text-center text-sm mb-6 max-w-xs leading-relaxed">
        ¿Puedes ordenar los openings de anime por año?
      </p>

      {/* Pack selector */}
      <div className="w-full max-w-xs mb-5">
        <button
          onClick={() => setShowPackMenu(v => !v)}
          className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gray-900 border border-gray-700 hover:border-gray-500 transition-colors"
        >
          <span className="font-['Nunito'] text-sm text-white truncate">{packLabel}</span>
          <span className="text-gray-400 text-xs ml-2">{showPackMenu ? '▲' : '▼'}</span>
        </button>

        <AnimatePresence>
          {showPackMenu && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 flex flex-col gap-2 p-3 bg-gray-950 border border-gray-800 rounded-xl">

                {/* Base option */}
                <PackOption
                  pack={PACKS.base}
                  checked={selectedPacks.includes('base') && selectedPacks.length === 1}
                  onToggle={() => setSelectedPacks(['base'])}
                  label="Solo base (60 canciones)"
                  free
                />

                {DLC_PACKS.map(pack => (
                  <div key={pack.id} className="flex flex-col gap-1">
                    <PackOption
                      pack={pack}
                      checked={selectedPacks.includes(pack.id) && !selectedPacks.includes('base')}
                      onToggle={() => selectOnlyPack(pack.id)}
                      label={`Solo ${pack.name}`}
                      free={pack.free}
                    />
                    <PackOption
                      pack={pack}
                      checked={selectedPacks.includes(pack.id) && selectedPacks.includes('base')}
                      onToggle={() => togglePack(pack.id)}
                      label={`Base + ${pack.name}`}
                      free={pack.free}
                      combined
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mode buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs mb-10">
        <motion.button
          onClick={() => startGame('normal')}
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
          onClick={() => startGame('yamete')}
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

      <div className="flex gap-4">
        <button
          onClick={() => navigate('/ranking')}
          className="text-gray-500 text-sm font-['Nunito'] hover:text-white transition-colors underline underline-offset-2"
        >
          VER RANKING
        </button>
        <span className="text-gray-700">·</span>
        <button
          onClick={() => navigate('/store')}
          className="text-gray-500 text-sm font-['Nunito'] hover:text-[#fcbe00] transition-colors underline underline-offset-2"
        >
          TIENDA
        </button>
      </div>
    </div>
  )
}

function PackOption({ pack, checked, onToggle, label, free, combined }) {
  const locked = !free
  return (
    <button
      onClick={locked ? undefined : onToggle}
      disabled={locked}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors w-full ${
        locked
          ? 'opacity-40 cursor-not-allowed'
          : checked
            ? 'bg-gray-800 border border-gray-600'
            : 'hover:bg-gray-900 border border-transparent'
      }`}
    >
      <span className="text-lg">{pack.emoji}</span>
      <span className="font-['Nunito'] text-sm text-white flex-1">{label}</span>
      {locked ? (
        <span className="text-[10px] font-['Nunito'] text-yellow-600">🔒 Próx.</span>
      ) : (
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${
          checked ? 'bg-[#fcbe00] border-[#fcbe00]' : 'border-gray-600'
        }`}>
          {checked && <span className="text-black text-[10px] font-black">✓</span>}
        </div>
      )}
    </button>
  )
}
