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

    // Intentar autoplay con sonido; si el navegador lo bloquea, reproducir sin sonido
    video.play().catch(() => {
      video.muted = true
      video.play().catch(() => {})
    })

    return () => video.removeEventListener('ended', finish)
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
    </div>
  )
}
