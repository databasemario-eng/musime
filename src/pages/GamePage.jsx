import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useGameLogic from '../hooks/useGameLogic'
import Card from '../components/Card'
import Timeline from '../components/Timeline'
import HUD from '../components/HUD'
import AudioPlayer from '../components/AudioPlayer'

export default function GamePage() {
  const navigate = useNavigate()
  const savedTime = parseInt(localStorage.getItem('musime_time') || '15', 10)
  const game = useGameLogic(savedTime)

  const [showAudio, setShowAudio] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [saved, setSaved] = useState(false)
  const [feedbackAnim, setFeedbackAnim] = useState(null)

  // reset UI state when card advances
  useEffect(() => {
    setShowAudio(false)
    setShowHint(false)
    setShowDetails(false)
    setHintUsed(false)
  }, [game.currentCard?.id])

  // feedback animation
  useEffect(() => {
    if (game.feedback) {
      setFeedbackAnim(game.feedback)
      const t = setTimeout(() => setFeedbackAnim(null), 900)
      return () => clearTimeout(t)
    }
  }, [game.feedback, game.attempt])

  function handleHint() {
    setShowDetails(true)
    setShowHint(true)
    setShowAudio(true)
    setHintUsed(true)
  }

  function handleSaveScore() {
    if (!playerName.trim()) return
    try {
      const raw = localStorage.getItem('musime_ranking')
      const ranking = raw ? JSON.parse(raw) : []
      ranking.push({ name: playerName.trim(), score: game.score, date: new Date().toLocaleDateString() })
      ranking.sort((a, b) => b.score - a.score)
      localStorage.setItem('musime_ranking', JSON.stringify(ranking.slice(0, 20)))
      setSaved(true)
    } catch { /* empty */ }
  }

  if (!game.currentCard && !game.finished) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Cargando…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#b7002b] to-black flex flex-col items-center gap-4 px-3 py-4 relative overflow-hidden">
      {/* feedback flash */}
      {feedbackAnim && (
        <div
          className={`fixed inset-0 pointer-events-none z-40 flex items-center justify-center
            ${feedbackAnim === 'correct' ? 'bg-green-500/20' : 'bg-red-600/30'}`}
          style={{ animation: 'fadeOut 0.9s ease forwards' }}
        >
          <span className="text-8xl drop-shadow-lg">
            {feedbackAnim === 'correct' ? '✅' : '❌'}
          </span>
        </div>
      )}

      {/* HUD */}
      <HUD
        chrono={game.chrono}
        score={game.score}
        currentIdx={game.currentIdx}
        total={game.totalCards}
        initialTime={game.initialTime}
      />

      {/* current card area */}
      {!game.finished && game.currentCard && (
        <div className="flex flex-col items-center gap-4 w-full max-w-md">
          <Card card={game.currentCard} showDetails={showDetails} />

          {/* attempt dots */}
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${
                  i < game.attempt ? 'bg-red-600' : 'bg-gray-700'
                }`}
              />
            ))}
          </div>

          {/* audio player */}
          {showAudio && (
            <AudioPlayer
              audioSrc={game.currentCard.audioSrc}
              spotifySrc={game.currentCard.spotifySrc}
              youtubeUrl={game.currentCard.youtube}
              showHint={showHint}
              hintImg={game.currentCard.img}
              onClose={() => setShowAudio(false)}
              timeLimit={game.initialTime}
            />
          )}

          {/* action buttons */}
          <div className="flex flex-wrap justify-center gap-2 w-full">
            <button
              onClick={() => setShowAudio((v) => !v)}
              className="px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {showAudio ? '⏹ Detener' : '▶ Escuchar Opening'}
            </button>

            {!hintUsed && (
              <button
                onClick={handleHint}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-yellow-300 rounded-xl font-semibold text-sm transition-colors"
              >
                🔍 Pista <span className="text-gray-400 text-xs">(-2pts)</span>
              </button>
            )}
            {hintUsed && showAudio && (
              <button
                onClick={() => setShowHint((v) => !v)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-yellow-300 rounded-xl font-semibold text-sm transition-colors"
              >
                {showHint ? '🙈 Ocultar pista' : '🔍 Ver pista'}
              </button>
            )}

            <button
              disabled={game.insertIdx === null}
              onClick={game.handleCheck}
              className={`px-6 py-2 rounded-xl font-bold text-sm transition-all ${
                game.insertIdx !== null
                  ? 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/50'
                  : 'bg-gray-800 text-gray-600 cursor-not-allowed'
              }`}
            >
              ¡COLOCAR!
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-400 rounded-xl text-sm transition-colors"
            >
              Abandonar
            </button>
          </div>

          <p className="text-gray-500 text-xs text-center">
            Selecciona una ranura en la línea temporal y pulsa ¡COLOCAR!
          </p>
        </div>
      )}

      {/* timeline */}
      <div className="w-full max-w-5xl">
        <p className="text-center text-gray-500 text-xs uppercase tracking-widest mb-2">Línea temporal</p>
        <Timeline
          timeline={game.timeline}
          insertIdx={game.insertIdx}
          onSlotClick={game.handleSlotClick}
          finished={game.finished}
        />
      </div>

      {/* finished modal */}
      {game.finished && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur z-50 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-red-700 rounded-3xl p-8 w-full max-w-sm text-center flex flex-col gap-5 shadow-2xl shadow-red-900">
            <h2 className="text-4xl font-black text-white">¡Fin!</h2>
            <div className="text-6xl font-black text-red-400">{game.score}</div>
            <p className="text-gray-400">puntos</p>

            {!saved ? (
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  maxLength={20}
                  className="bg-gray-800 border border-gray-600 rounded-xl px-4 py-2 text-white text-center focus:outline-none focus:border-red-500"
                />
                <button
                  onClick={handleSaveScore}
                  disabled={!playerName.trim()}
                  className="px-6 py-3 bg-red-600 hover:bg-red-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold rounded-xl transition-colors"
                >
                  Guardar puntuación
                </button>
              </div>
            ) : (
              <p className="text-green-400 font-semibold">¡Puntuación guardada!</p>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => { game.handleReset(); setShowAudio(false); setSaved(false); setPlayerName('') }}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
              >
                Jugar de nuevo
              </button>
              <button
                onClick={() => navigate('/ranking')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-colors"
              >
                Ver ranking
              </button>
            </div>

            <button
              onClick={() => navigate('/')}
              className="text-sm text-gray-600 hover:text-gray-400 transition-colors"
            >
              Volver al inicio
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeOut {
          0% { opacity: 1; }
          70% { opacity: 0.6; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
