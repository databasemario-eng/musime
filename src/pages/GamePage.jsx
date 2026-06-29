import { useState, useEffect } from 'react'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGameLogic from '../hooks/useGameLogic'
import AudioPlayer from '../components/AudioPlayer'
import Card from '../components/Card'
import Timeline from '../components/Timeline'
import HUD from '../components/HUD'
import { supabase } from '../lib/supabase'
import { sanitizeName, isValidScore, isValidMode, checkRateLimit } from '../utils/security'
import { PACKS } from '../data/packs'

const VALID_PACK_IDS = Object.keys(PACKS)

function parsePacks(searchParams) {
  const raw = searchParams.get('packs') ?? 'base'
  const ids = raw.split(',').filter(id => VALID_PACK_IDS.includes(id))
  return ids.length > 0 ? ids : ['base']
}

export default function GamePage() {
  const { mode = 'normal' } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const safeMode = isValidMode(mode) ? mode : 'normal'
  const packIds = parsePacks(searchParams)

  const [showAudio, setShowAudio] = useState(false)
  const [activeAudio, setActiveAudio] = useState(null)
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(false)

  const {
    timeline, currentCard, score, totalFails,
    chrono, insertIdx, feedback, gameOver, hintUsed, timeLimit,
    handleSlotClick, handleCheck, handleHint, handleStartAudio, nextCard, handleReset,
  } = useGameLogic(safeMode, packIds)

  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => {
      if (!gameOver) {
        setShowAudio(false)
        setActiveAudio(null)
        nextCard()
      }
    }, 800)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback])

  async function handleSave() {
    if (!playerName.trim() || saving) return

    const cleanName = sanitizeName(playerName)
    if (!cleanName) return
    if (!isValidScore(score)) return
    if (!checkRateLimit('ranking_save', 8000)) return

    setSaving(true)
    setSaveError(false)
    const { error } = await supabase.from('ranking').insert({
      nombre: cleanName,
      score,
      mode: safeMode,
    })
    if (error) {
      setSaveError(true)
      setSaving(false)
    } else {
      setSaved(true)
    }
  }

  function handleRestart() {
    handleReset()
    setSaved(false)
    setSaving(false)
    setSaveError(false)
    setShowAudio(false)
    setActiveAudio(null)
    setPlayerName('')
  }

  const deckFinished = !currentCard && !gameOver

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="bg-gray-950 border-b border-gray-800 px-4 py-1 flex items-center">
        <button
          onClick={() => navigate('/')}
          className="text-white text-sm font-['Nunito'] opacity-60 hover:opacity-100 transition-opacity flex items-center gap-1"
        >
          ← INICIO
        </button>
      </div>
      <HUD
        score={score}
        chrono={chrono}
        timeLimit={timeLimit}
        mode={safeMode}
        totalFails={totalFails}
      />

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-6">

        {deckFinished ? (
          <div className="text-center">
            <p className="text-[#fcbe00] font-['Bangers'] text-5xl tracking-widest">¡COMPLETADO!</p>
            <p className="text-white font-['Nunito'] mt-2">Puntuación: <span className="font-black text-[#fcbe00]">{score}</span></p>
          </div>
        ) : (
          <>
            <Card card={currentCard} showHint={hintUsed} />

            {showAudio && currentCard && (
              <AudioPlayer
                audioSrc={activeAudio}
                onStart={handleStartAudio}
                timeLimit={timeLimit}
                showHint={hintUsed}
                hintImg={currentCard?.img}
                animeName={currentCard?.anime}
                mode={safeMode}
              />
            )}

            <AnimatePresence>
              {feedback && (
                <motion.div
                  key={feedback}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-40 flex items-center justify-center pointer-events-none"
                  style={{
                    background:
                      feedback === 'correct'
                        ? 'rgba(34,197,94,0.18)'
                        : feedback === 'timeout'
                        ? 'rgba(249,115,22,0.18)'
                        : 'rgba(239,68,68,0.18)',
                  }}
                >
                  <motion.div
                    initial={{ scale: 0.5, y: 10 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.5, y: 10 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 22 }}
                    className={`px-8 py-5 rounded-3xl font-['Bangers'] text-3xl tracking-widest border-2 backdrop-blur-sm ${
                      feedback === 'correct'
                        ? 'bg-green-900/60 text-green-300 border-green-400 shadow-lg shadow-green-500/30'
                        : feedback === 'timeout'
                        ? 'bg-orange-900/60 text-orange-300 border-orange-400 shadow-lg shadow-orange-500/30'
                        : 'bg-red-900/60 text-red-300 border-red-500 shadow-lg shadow-red-500/30'
                    }`}
                  >
                    {feedback === 'correct'
                      ? '✅ ¡CORRECTO!'
                      : feedback === 'timeout'
                      ? '⏱ ¡TIEMPO!'
                      : '❌ ¡INCORRECTO!'}
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 flex-wrap justify-center">
              {!showAudio && (
                <button
                  onClick={() => {
                    setActiveAudio(currentCard.audio)
                    setShowAudio(true)
                  }}
                  className="bg-[#fcbe00] text-black font-['Bangers'] text-xl tracking-wider px-7 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                  ▶ ESCUCHAR
                </button>
              )}

              {safeMode === 'normal' && !hintUsed && (
                <button
                  onClick={handleHint}
                  className="bg-gray-800 border border-gray-600 text-gray-300 font-['Nunito'] font-bold text-sm px-5 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform"
                >
                  💡 PISTA (-1pt)
                </button>
              )}

              <button
                onClick={handleCheck}
                disabled={insertIdx === null}
                className={`font-['Bangers'] text-xl tracking-wider px-7 py-3 rounded-xl transition-all ${
                  insertIdx === null
                    ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                    : 'bg-[#b7002b] text-white hover:scale-105 active:scale-95 shadow-lg shadow-[#b7002b]/30'
                }`}
              >
                ✓ COLOCAR
              </button>
            </div>
          </>
        )}
      </div>

      <div className="border-t border-gray-800 bg-gray-950 py-3">
        <Timeline
          timeline={timeline}
          insertIdx={insertIdx}
          onSlotClick={handleSlotClick}
          activeCard={currentCard}
        />
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {gameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="bg-gray-950 border-2 border-[#b7002b] rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl"
              style={{ boxShadow: '0 0 40px #b7002b40, 0 25px 50px rgba(0,0,0,0.8)' }}
            >
              <p
                className="font-['Bangers'] text-6xl tracking-widest mb-1"
                style={{ color: '#b7002b', textShadow: '0 0 20px #b7002b80' }}
              >
                GAME OVER
              </p>
              <p className="text-gray-500 font-['Nunito'] text-sm mb-3">Puntuación final</p>
              <motion.p
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                className="font-['Bangers'] text-7xl tracking-wider mb-6"
                style={{ color: '#fcbe00', textShadow: '0 0 24px #fcbe0060' }}
              >
                {score}
              </motion.p>

              {!saved ? (
                <>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value.slice(0, 20))}
                    maxLength={20}
                    className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 mb-3 outline-none border border-gray-700 focus:border-[#fcbe00] font-['Nunito'] transition-colors"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!playerName.trim() || saving}
                    className="w-full bg-[#fcbe00] text-black font-['Bangers'] text-xl tracking-wider py-3 rounded-xl mb-3 disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
                  >
                    {saving ? 'GUARDANDO...' : 'GUARDAR EN RANKING'}
                  </button>
                  {saveError && (
                    <p className="text-red-400 font-['Nunito'] text-sm mb-3">
                      ❌ Error al guardar. Inténtalo de nuevo.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-green-400 font-['Nunito'] font-bold mb-4">✅ ¡Guardado en el ranking!</p>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleRestart}
                  className="flex-1 bg-gray-800 text-white font-['Bangers'] tracking-wider text-lg py-3 rounded-xl hover:bg-gray-700 transition-colors"
                >
                  JUGAR DE NUEVO
                </button>
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 bg-gray-900 text-gray-300 font-['Bangers'] tracking-wider text-lg py-3 rounded-xl hover:bg-gray-800 transition-colors border border-gray-800"
                >
                  INICIO
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
