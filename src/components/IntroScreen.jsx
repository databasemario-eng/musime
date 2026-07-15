import { useEffect, useRef, useState } from 'react'

export default function IntroScreen({ onComplete }) {
  const videoRef = useRef(null)
  const done = useRef(false)
  const [fading, setFading] = useState(false)

  function finish() {
    if (done.current) return
    done.current = true
    setFading(true)
    setTimeout(onComplete, 600)
  }

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.addEventListener('ended', finish, { once: true })

    // Autoplay silencioso: es lo unico que garantiza reproduccion automatica
    // sin gesto del usuario en todos los navegadores (incluido iOS Safari).
    video.muted = true
    const playPromise = video.play()
    if (playPromise && playPromise.catch) playPromise.catch(() => {})

    return () => video.removeEventListener('ended', finish)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black cursor-pointer flex items-center justify-center px-4"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease-in-out' }}
      onClick={finish}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full max-w-[420px] h-auto object-contain rounded-2xl shadow-2xl"
        autoPlay
        muted
        playsInline
        preload="auto"
      />
    </div>
  )
}
