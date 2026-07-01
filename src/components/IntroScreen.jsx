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
    video.play().catch(() => {})
    video.addEventListener('ended', finish)
    return () => video.removeEventListener('ended', finish)
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 bg-black flex items-center justify-center cursor-pointer"
      onClick={finish}
      style={{
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.6s ease-in-out',
      }}
    >
      <video
        ref={videoRef}
        src="/intro.mp4"
        className="w-full h-full object-cover"
        playsInline
        muted={false}
      />

      <p className="absolute bottom-6 text-gray-400 text-xs font-['Nunito'] tracking-widest uppercase animate-pulse select-none">
        Toca para saltar
      </p>
    </div>
  )
}
