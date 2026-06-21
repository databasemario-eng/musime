import { useState, useRef, useEffect } from 'react'

// mode 'local'   → playing from local MP3
// mode 'spotify' → Spotify embed iframe
// mode 'failed'  → nothing worked, show YouTube link

function initialMode(audioSrc, spotifySrc) {
  if (audioSrc) return 'local'
  if (spotifySrc) return 'spotify'
  return 'failed'
}

export default function AudioPlayer({ audioSrc, spotifySrc, youtubeUrl, showHint = false, hintImg, onClose, timeLimit = 30 }) {
  const [mode, setMode] = useState(() => initialMode(audioSrc, spotifySrc))
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  // Reset when source changes (new card)
  useEffect(() => {
    setMode(initialMode(audioSrc, spotifySrc))
    setCurrentTime(0)
    setDuration(0)
    setPlaying(false)
  }, [audioSrc, spotifySrc])

  // Auto-play local audio
  useEffect(() => {
    if (mode !== 'local') return
    const audio = audioRef.current
    if (!audio || !audioSrc) return
    audio.load()
    audio.play().then(() => setPlaying(true)).catch(() => {})
    return () => { audioRef.current?.pause() }
  }, [audioSrc, mode])

  function handleLocalError() {
    setPlaying(false)
    setMode(spotifySrc ? 'spotify' : 'failed')
  }

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play().then(() => setPlaying(true)).catch(() => {}) }
  }

  function handleProgressClick(e) {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * duration
  }

  const effectiveDuration = duration || timeLimit
  const pct = effectiveDuration > 0 ? Math.min((currentTime / effectiveDuration) * 100, 100) : 0
  const remaining = Math.max(effectiveDuration - currentTime, 0)

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-xs mx-auto">

      {/* 320×180 visual area */}
      <div style={{ position: 'relative', width: 320, height: 180, flexShrink: 0, overflow: 'hidden' }}>
        {mode === 'spotify' ? (
          <iframe
            src={`https://open.spotify.com/embed/track/${spotifySrc}?utm_source=generator&autoplay=1`}
            style={{ width: '100%', height: '100%', border: 'none' }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: showHint ? 'transparent' : '#1a0005',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            {showHint
              ? hintImg && <img src={hintImg} alt="pista" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <img src="/logo-musime.png" alt="MUSIME" style={{ width: 160, objectFit: 'contain', opacity: 0.85 }} />
            }
          </div>
        )}
      </div>

      {/* hidden audio element — only mounted in local mode */}
      {mode === 'local' && (
        <audio
          ref={audioRef}
          src={audioSrc}
          onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime ?? 0)}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration ?? 0)}
          onEnded={() => setPlaying(false)}
          onError={handleLocalError}
          preload="auto"
        />
      )}

      {/* --- controls bar (varies by mode) --- */}

      {mode === 'local' && (
        <div className="w-full bg-gray-900 border border-red-800 rounded-xl px-4 py-2 flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <button onClick={togglePlay} className="text-white text-base w-6 flex-shrink-0">
              {playing ? '⏸' : '▶'}
            </button>
            <span className="text-white text-sm font-semibold flex-1">
              {playing ? 'Escuchando opening…' : 'Pausado'}
            </span>
            <span className="text-red-400 font-black tabular-nums text-sm">{Math.ceil(remaining)}s</span>
            <button onClick={onClose} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded transition-colors">
              ✕ Cerrar
            </button>
          </div>
          <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden cursor-pointer" onClick={handleProgressClick}>
            <div className="h-full bg-red-500 rounded-full" style={{ width: `${pct}%`, transition: 'width 0.1s linear' }} />
          </div>
        </div>
      )}

      {mode === 'spotify' && (
        <div className="w-full bg-gray-900 border border-green-800 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-green-400 text-sm font-semibold flex-1">♪ Reproduciendo en Spotify</span>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded transition-colors">
            ✕ Cerrar
          </button>
        </div>
      )}

      {mode === 'failed' && (
        <div className="w-full bg-gray-900 border border-gray-700 rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-gray-400 text-sm flex-1">Audio no disponible</span>
          {youtubeUrl && (
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 border border-red-800 rounded transition-colors whitespace-nowrap"
            >
              ▶ Ver en YouTube
            </a>
          )}
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xs px-2 py-1 rounded transition-colors">
            ✕ Cerrar
          </button>
        </div>
      )}

    </div>
  )
}
