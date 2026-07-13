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
    // Si el vídeo falla o se cuelga cargando, no bloquear al usuario
    video.addEventListener('error', finish, { once: true })
    video.addEventListener('stalled', finish, { once: true })

    // Intentar autoplay con sonido; si el navegador lo bloquea, reproducir sin sonido
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => finish())
    })

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
      className="fixed inset-0 z-50 bg-black cursor-pointer"
      style={{ opacity: fading ? 0 : 1, transition: 'opacity 0.6s ease-in-out' }}
      onClick={finish}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full h-full object-cover"
        playsInline
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
