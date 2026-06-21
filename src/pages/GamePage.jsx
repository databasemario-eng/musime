import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import useGameLogic from '../hooks/useGameLogic'
import AudioPlayer from '../components/AudioPlayer'
import Card from '../components/Card'
import Timeline from '../components/Timeline'
import HUD from '../components/HUD'
import { supabase } from '../lib/supabase'

export default function GamePage() {
  const { mode = 'normal' } = useParams()
  const navigate = useNavigate()
  const [showAudio, setShowAudio] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)

  const {
    timeline, currentCard, score, totalFails,
    chrono, insertIdx, feedback, gameOver, hintUsed, timeLimit,
    handleSlotClick, handleCheck, handleHint, handleStartAudio, nextCard, handleReset,
  } = useGameLogic(mode)

  // Auto-clear feedback and advance UI after each result
  useEffect(() => {
    if (!feedback) return
    const t = setTimeout(() => {
      if (!gameOver) {
        setShowAudio(false)
        nextCard()
      }
    }, 1500)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [feedback])

  async function handleSave() {
    if (!playerName.trim()) return
    await supabase.from('ranking').insert({ nombre: playerName.trim(), score, mode })
    setSaved(true)
  }

  function handleRestart() {
    handleReset()
    setSaved(false)
    setShowAudio(false)
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
        mode={mode}
        totalFails={totalFails}
      />

      {/* Main play area */}
      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-6">

        {deckFinished ? (
          <div className="text-center">
            <p className="text-[#fcbe00] font-['Bangers'] text-5xl tracking-widest">¡COMPLETADO!</p>
            <p className="text-white font-['Nunito'] mt-2">Puntuación: <span className="font-black text-[#fcbe00]">{score}</span></p>
          </div>
        ) : (
          <>
            {/* Current card */}
            <Card card={currentCard} revealed={hintUsed} />

            {/* Audio player */}
            {showAudio && currentCard && (
              <AudioPlayer
                audioSrc={currentCard.audio}
                onStart={handleStartAudio}
                timeLimit={timeLimit}
                showHint={hintUsed}
                hintImg={currentCard?.img}
                animeName={currentCard?.anime}
              />
            )}

            {/* Feedback */}
            <AnimatePresence>
              {feedback && (
                <motion.div
                  key={feedback + Date.now()}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={`px-6 py-3 rounded-2xl font-['Bangers'] text-2xl tracking-widest border-2 ${
                    feedback === 'correct'
                      ? 'bg-green-500/20 text-green-400 border-green-500'
                      : 'bg-red-500/20 text-red-400 border-red-500'
                  }`}
                >
                  {feedback === 'correct' ? '✅ CORRECTO' : feedback === 'timeout' ? '⏰ TIEMPO' : '❌ INCORRECTO'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action buttons */}
            <div className="flex gap-3 flex-wrap justify-center">
              {!showAudio && (
                <button
                  onClick={() => setShowAudio(true)}
                  className="bg-[#fcbe00] text-black font-['Bangers'] text-xl tracking-wider px-7 py-3 rounded-xl hover:scale-105 active:scale-95 transition-transform shadow-lg"
                >
                  ▶ ESCUCHAR
                </button>
              )}

              {mode === 'normal' && !hintUsed && (
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

      {/* Timeline */}
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
              className="bg-gray-950 border-2 border-[#b7002b] rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl shadow-[#b7002b]/20"
            >
              <p className="text-[#b7002b] font-['Bangers'] text-5xl tracking-widest mb-1">GAME OVER</p>
              <p className="text-gray-500 font-['Nunito'] text-sm mb-3">Puntuación final</p>
              <p className="text-[#fcbe00] font-['Bangers'] text-6xl tracking-wider mb-6">{score}</p>

              {!saved ? (
                <>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={playerName}
                    onChange={e => setPlayerName(e.target.value)}
                    maxLength={20}
                    className="w-full bg-gray-900 text-white rounded-xl px-4 py-3 mb-3 outline-none border border-gray-700 focus:border-[#fcbe00] font-['Nunito'] transition-colors"
                  />
                  <button
                    onClick={handleSave}
                    disabled={!playerName.trim()}
                    className="w-full bg-[#fcbe00] text-black font-['Bangers'] text-xl tracking-wider py-3 rounded-xl mb-3 disabled:opacity-30 hover:scale-105 active:scale-95 transition-transform"
                  >
                    GUARDAR EN RANKING
                  </button>
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
