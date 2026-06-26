import { useEffect, useRef, useState } from 'react'

const TOTAL_DURATION = 5000

// Web Audio API synthetic sounds — no external files needed
function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()

    if (type === 'impact') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sawtooth'
      osc.frequency.setValueAtTime(80, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3)
      gain.gain.setValueAtTime(1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.3)

    } else if (type === 'whoosh') {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.type = 'sine'
      osc.frequency.setValueAtTime(800, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.4)
      gain.gain.setValueAtTime(0.6, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + 0.4)

    } else if (type === 'chime') {
      [[880, 0.5], [1100, 0.35]].forEach(([freq, vol]) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        gain.gain.setValueAtTime(vol, ctx.currentTime)
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6)
        osc.start(ctx.currentTime)
        osc.stop(ctx.currentTime + 0.6)
      })
    }
  } catch {
    // Web Audio not available — silent fail
  }
}

export default function IntroScreen({ onComplete }) {
  const [phase, setPhase] = useState('black')
  const done = useRef(false)

  function finish() {
    if (done.current) return
    done.current = true
    onComplete()
  }

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase('speedlines'),  300),
      setTimeout(() => {
        setPhase('flash')
        playSound('impact')
      }, 800),
      setTimeout(() => setPhase('logo'),         900),
      setTimeout(() => setPhase('kanji'),       1500),
      setTimeout(() => {
        setPhase('title')
        playSound('whoosh')
      }, 2000),
      setTimeout(() => setPhase('subtitle'),    2800),
      setTimeout(() => setPhase('zoomout'),     3500),
      setTimeout(() => setPhase('fadeout'),     4500),
      setTimeout(() => {
        playSound('chime')
        finish()
      }, TOTAL_DURATION),
    ]
    return () => timers.forEach(clearTimeout)
  }, [])

  const showSpeedlines = ['speedlines','flash','logo','kanji','title','subtitle','zoomout','fadeout'].includes(phase)
  const showFlash      = phase === 'flash'
  const showLogo       = ['logo','kanji','title','subtitle','zoomout','fadeout'].includes(phase)
  const showKanji      = ['kanji','title','subtitle','zoomout','fadeout'].includes(phase)
  const showTitle      = ['title','subtitle','zoomout','fadeout'].includes(phase)
  const showSubtitle   = ['subtitle','zoomout','fadeout'].includes(phase)
  const zoomOut        = ['zoomout','fadeout'].includes(phase)
  const fadeOut        = phase === 'fadeout'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden cursor-pointer select-none"
      onClick={finish}
    >
      {/* Speed lines SVG */}
      {showSpeedlines && (
        <svg
          className="absolute inset-0 w-full h-full animate-speedlines"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          style={{ opacity: showLogo ? 0.25 : 0.9 }}
        >
          {Array.from({ length: 36 }, (_, i) => {
            const angle = (i / 36) * 360
            const rad = (angle * Math.PI) / 180
            const x2 = 400 + Math.cos(rad) * 1200
            const y2 = 300 + Math.sin(rad) * 1200
            return (
              <line
                key={i}
                x1="400" y1="300"
                x2={x2} y2={y2}
                stroke="white"
                strokeWidth={i % 3 === 0 ? 3 : 1}
                strokeOpacity={i % 3 === 0 ? 0.9 : 0.4}
              />
            )
          })}
        </svg>
      )}

      {/* White flash */}
      {showFlash && (
        <div className="absolute inset-0 bg-white animate-flash pointer-events-none" />
      )}

      {/* Main content */}
      <div
        className="relative flex flex-col items-center gap-4"
        style={{
          transform: zoomOut ? 'scale(0.85)' : 'scale(1)',
          opacity: fadeOut ? 0 : 1,
          transition: 'transform 700ms ease-in-out, opacity 600ms ease-in-out',
        }}
      >
        {/* Kanji */}
        {showKanji && (
          <p
            className="font-['Bangers'] text-5xl tracking-widest animate-dropIn"
            style={{ color: '#b7002b', textShadow: '0 0 20px #b7002b80' }}
          >
            音楽
          </p>
        )}

        {/* Logo with red pulsing glow */}
        {showLogo && (
          <div className="relative flex items-center justify-center animate-logoHit">
            {/* Glow layer behind logo */}
            <div
              className="absolute rounded-full animate-logoPulse"
              style={{
                width: '80%',
                height: '60%',
                background: 'radial-gradient(ellipse at center, #b7002b55 0%, transparent 70%)',
                filter: 'blur(20px)',
              }}
            />
            <img
              src="/logo-musime.png"
              alt="MUSIME"
              className="relative w-96 md:w-[600px] object-contain"
            />
          </div>
        )}

        {/* MUSIME typewriter */}
        {showTitle && (
          <p
            className="font-['Bangers'] text-6xl tracking-[0.3em] animate-fadeIn"
            style={{ color: '#fcbe00', textShadow: '0 0 30px #fcbe0060' }}
          >
            <TypeWriter text="MUSIME" duration={700} />
          </p>
        )}

        {/* Subtitle */}
        {showSubtitle && (
          <p
            className="font-['Nunito'] font-black text-white text-sm tracking-[0.25em] uppercase animate-slideUp"
          >
            El juego de anime musical
          </p>
        )}
      </div>

      {/* Skip hint */}
      <p className="absolute bottom-6 text-gray-600 text-xs font-['Nunito'] tracking-widest uppercase animate-pulse">
        Toca para saltar
      </p>

      <style>{`
        @keyframes speedlines-in {
          from { opacity: 0; transform: scale(0.3); }
          to   { opacity: 1; transform: scale(1); }
        }
        .animate-speedlines {
          animation: speedlines-in 0.4s ease-out forwards;
        }

        @keyframes flash-out {
          0%   { opacity: 1; }
          100% { opacity: 0; }
        }
        .animate-flash {
          animation: flash-out 0.25s ease-out forwards;
        }

        @keyframes logo-hit {
          0%   { transform: scale(1.5); opacity: 0; }
          40%  { transform: scale(0.95); opacity: 1; }
          55%  { transform: scale(1.03) translateX(-2px); }
          65%  { transform: scale(1.0)  translateX(2px); }
          75%  { transform: scale(1.0)  translateX(-2px); }
          85%  { transform: scale(1.0)  translateX(1px); }
          100% { transform: scale(1.0)  translateX(0); }
        }
        .animate-logoHit {
          animation: logo-hit 0.55s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }

        @keyframes logo-pulse {
          0%   { box-shadow: 0 0 60px #b7002b, 0 0 120px #b7002b44; opacity: 0.8; }
          50%  { box-shadow: 0 0 100px #b7002b, 0 0 200px #b7002b66; opacity: 1; }
          100% { box-shadow: 0 0 60px #b7002b, 0 0 120px #b7002b44; opacity: 0.8; }
        }
        .animate-logoPulse {
          animation: logo-pulse 1.4s ease-in-out infinite;
          box-shadow: 0 0 60px #b7002b, 0 0 120px #b7002b44;
        }

        @keyframes drop-in {
          from { transform: translateY(-20px); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        .animate-dropIn {
          animation: drop-in 0.35s ease-out forwards;
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0);    opacity: 1; }
        }
        .animate-slideUp {
          animation: slide-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

function TypeWriter({ text, duration }) {
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const step = duration / text.length
    const timers = text.split('').map((_, i) =>
      setTimeout(() => setVisible(i + 1), step * i)
    )
    return () => timers.forEach(clearTimeout)
  }, [text, duration])

  return (
    <>
      <span>{text.slice(0, visible)}</span>
      <span className="opacity-0">{text.slice(visible)}</span>
    </>
  )
}
