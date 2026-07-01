import { useRef, useState } from 'react'

export default function IntroScreen({ onComplete }) {
  const videoRef = useRef(null)
  const done = useRef(false)
  const [started, setStarted] = useState(false)
  const [fading, setFading] = useState(false)

  function finish() {
    if (done.current) return
    done.current = true
    setFading(true)
    setTimeout(onComplete, 600)
  }

  function handleStart() {
    const video = videoRef.current
    if (!video) return
    setStarted(true)
    video.play().catch(() => {})
    video.addEventListener('ended', finish, { once: true })
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease-in-out' }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full h-full object-cover"
        playsInline
      />

      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
          <button
            onClick={handleStart}
            className="w-24 h-24 rounded-full bg-[#b7002b] flex items-center justify-center shadow-2xl shadow-[#b7002b]/50 hover:scale-110 active:scale-95 transition-transform"
            style={{ boxShadow: '0 0 60px #b7002b80' }}
          >
            <span className="text-white text-5xl ml-2">▶</span>
          </button>
          <p className="text-gray-400 font-['Nunito'] text-sm mt-5 tracking-widest uppercase">
            Pulsa para comenzar
          </p>
        </div>
      )}

      {started && (
        <button
          onClick={finish}
          className="absolute bottom-6 right-6 text-gray-500 font-['Nunito'] text-xs tracking-widest uppercase hover:text-white transition-colors"
        >
          Saltar →
        </button>
      )}
    </div>
  )
}
