import { useRef, useState, useEffect } from 'react'

export default function AudioPlayer({ audioSrc, onStart, timeLimit, showHint, hintImg, animeName, mode }) {
  const audioRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(false)
  const silenceOffsetRef = useRef(0)
  const metadataReadyRef = useRef(false)

  // Offline silence analysis: find first non-silent sample and store the timestamp.
  // Runs in parallel with the audio element's own network fetch (browser caches the URL).
  // Skipped for 'yamete' mode which uses a random start instead.
  useEffect(() => {
    silenceOffsetRef.current = 0
    metadataReadyRef.current = false
    if (!audioSrc || mode === 'yamete') return

    let cancelled = false

    async function findSilenceEnd() {
      try {
        const res = await fetch(audioSrc)
        const buf = await res.arrayBuffer()
        if (cancelled) return

        const ctx = new AudioContext()
        const decoded = await ctx.decodeAudioData(buf)
        ctx.close()
        if (cancelled) return

        const data = decoded.getChannelData(0)
        const sr = decoded.sampleRate
        const threshold = 0.005

        for (let i = 0; i < data.length; i++) {
          if (Math.abs(data[i]) > threshold) {
            // Go 50ms before first sound so the attack isn't clipped
            const offset = Math.max(0, i / sr - 0.05)
            silenceOffsetRef.current = offset

            // If metadata already fired, apply immediately
            const audio = audioRef.current
            if (audio && metadataReadyRef.current && audio.currentTime < offset) {
              audio.currentTime = offset
            }
            return
          }
        }
      } catch {
        // silent fail — audio still plays from the start
      }
    }

    findSilenceEnd()
    return () => { cancelled = true }
  }, [audioSrc, mode])

  // Playback effect
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

  function handleLoadedMetadata() {
    metadataReadyRef.current = true
    const audio = audioRef.current
    if (!audio) return

    if (mode === 'yamete') {
      const maxStart = Math.max(0, audio.duration - 15)
      audio.currentTime = Math.random() * maxStart
      return
    }

    // Apply silence offset if analysis already finished
    const offset = silenceOffsetRef.current
    if (offset > 0) {
      audio.currentTime = offset
    }
  }

  if (error) {
    return (
      <div className="w-full max-w-xs p-4 bg-gray-900 rounded-xl text-center text-gray-500 text-sm border border-gray-800">
        Audio no disponible
      </div>
    )
  }

  return (
    <div className="w-full max-w-xs rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 shadow-lg">
      <audio ref={audioRef} src={audioSrc} onLoadedMetadata={handleLoadedMetadata} />

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
