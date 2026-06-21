import { useRef, useState, useEffect } from 'react'

export default function AudioPlayer({ audioSrc, onStart, timeLimit, showHint, hintImg, animeName }) {
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100)
      }
    }
    const handleError = () => setError(true)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('error', handleError)

    onStart?.()
    audio.play().catch(() => setError(true))

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('error', handleError)
      audio.pause()
    }
  }, [audioSrc])

  if (error) {
    return (
      <div className="w-full max-w-xs p-4 bg-gray-900 rounded-xl text-center text-gray-500 text-sm border border-gray-800">
        Audio no disponible
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shadow-lg">
      <audio ref={audioRef} src={audioSrc} />

      <div className="relative h-32 flex items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900">
        {showHint ? (
          <div className="flex flex-col items-center gap-2">
            <img
              src={hintImg}
              alt={animeName}
              className="h-20 w-16 object-cover rounded-lg border border-[#b7002b] shadow"
              onError={e => { e.target.style.display = 'none' }}
            />
            <p className="text-white text-sm font-bold font-['Nunito']">{animeName}</p>
          </div>
        ) : (
          <img
            src="/logo-musime.png"
            alt="MUSIME"
            className="h-20 object-contain opacity-70"
          />
        )}
      </div>

      <div className="h-2 bg-gray-800">
        <div
          className="h-full bg-[#fcbe00] transition-all duration-100 rounded-r-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
