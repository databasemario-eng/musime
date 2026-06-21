export default function HUD({ score, chrono, timeLimit, mode, totalFails }) {
  const radius = 36
  const circumference = 2 * Math.PI * radius
  const ratio = Math.max(0, Math.min(1, chrono / timeLimit))
  const dashOffset = circumference * (1 - ratio)

  const timerColor = ratio > 0.6 ? '#22c55e' : ratio > 0.3 ? '#fcbe00' : '#ef4444'
  const glowColor  = ratio > 0.6 ? '#22c55e40' : ratio > 0.3 ? '#fcbe0040' : '#ef444440'

  const maxFails = 2
  const remainingFails = Math.max(0, maxFails - totalFails)

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-950 border-b border-gray-800 sticky top-0 z-20">

      {/* Timer SVG */}
      <div className="relative w-[72px] h-[72px]" style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          {/* Track */}
          <circle cx="50" cy="50" r={radius} stroke="#1f2937" strokeWidth="10" fill="none" />
          {/* Progress */}
          <circle
            cx="50" cy="50" r={radius}
            stroke={timerColor}
            strokeWidth="10"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s ease' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-black text-2xl leading-none tabular-nums">{chrono}</span>
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <p className="text-gray-600 text-[10px] uppercase tracking-widest font-['Nunito'] mb-0.5">Puntos</p>
        <p
          className="font-['Bangers'] text-5xl tracking-wider leading-none"
          style={{ color: '#fcbe00', textShadow: '0 0 12px #fcbe0060' }}
        >
          {score}
        </p>
      </div>

      {/* Mode + Lives */}
      <div className="text-right min-w-[64px]">
        <p
          className="font-['Bangers'] text-sm tracking-widest mb-1.5 leading-none"
          style={{ color: mode === 'yamete' ? '#b7002b' : '#9ca3af' }}
        >
          {mode === 'yamete' ? 'YAMETE' : 'NORMAL'}
        </p>

        {mode === 'normal' && (
          <div className="flex gap-1.5 justify-end">
            {Array.from({ length: maxFails }).map((_, i) => (
              <span
                key={i}
                className="text-2xl leading-none transition-all duration-300"
                style={{
                  color: i < remainingFails ? '#ef4444' : '#1f2937',
                  filter: i < remainingFails ? 'drop-shadow(0 0 4px #ef444480)' : 'none',
                }}
              >
                ♥
              </span>
            ))}
          </div>
        )}

        {mode === 'yamete' && (
          <span
            className="text-2xl leading-none"
            style={{ color: '#b7002b', filter: 'drop-shadow(0 0 4px #b7002b80)' }}
          >
            ☠
          </span>
        )}
      </div>
    </div>
  )
}
