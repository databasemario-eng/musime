import { useEffect, useRef, useState } from 'react'
import { withBase } from '../utils/withBase'

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
    // Si el vídeo falla o se cuelga cargando, no bloquear al usuario
    video.addEventListener('error', finish, { once: true })
    video.addEventListener('stalled', finish, { once: true })

    // Autoplay silencioso: es lo unico que garantiza reproduccion automatica
    // sin gesto del usuario en todos los navegadores (incluido iOS Safari).
    video.muted = true
    const playPromise = video.play()
    if (playPromise && playPromise.catch) playPromise.catch(() => {})

    // Red de seguridad: si en 6s no ha arrancado la reproducción real
    // (readyState sigue en 0, es decir sin datos cargados), saltamos el intro.
    const safety = setTimeout(() => {
      if (video.readyState === 0) finish()
    }, 6000)

    return () => {
      clearTimeout(safety)
      video.removeEventListener('ended', finish)
      video.removeEventListener('error', finish)
      video.removeEventListener('stalled', finish)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black cursor-pointer flex items-center justify-center px-4"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease-in-out' }}
      onClick={finish}
    >
      <video
        ref={videoRef}
        src={withBase('/intro.mp4')}
        className="w-full max-w-[420px] h-auto object-contain rounded-2xl shadow-2xl"
        autoPlay
        muted
        playsInline
        preload="auto"
      />
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); finish() }}
        className="absolute bottom-6 right-6 text-white/80 text-sm font-bold tracking-wide px-4 py-2 rounded-full bg-black/40 hover:bg-black/60 transition"
      >
        Saltar intro &gt;&gt;
      </button>
    </div>
  )
}
